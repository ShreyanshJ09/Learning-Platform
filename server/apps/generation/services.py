import logging
import os
import time
from typing import Any, Callable
from uuid import UUID

from django.db import transaction
from google import genai
from google.genai import errors
from google.genai import types

from apps.courses.models import Course, Lesson, Module

from .exceptions import GeminiConfigurationError, GeminiServiceError
from .parser import CourseOutline, LessonContent, parse_course_outline, parse_lesson_content
from .prompts import generate_course_prompt, generate_lesson_prompt

logger = logging.getLogger(__name__)

DEFAULT_GEMINI_MODEL = "gemini-3.5-flash"
MAX_GEMINI_ATTEMPTS = 1


def generate_course_for_user(*, topic: str, user: Any) -> Course:
    outline = generate_course_outline(topic=topic)
    return create_course_from_outline(topic=topic, user=user, outline=outline)


def generate_course_outline(*, topic: str) -> CourseOutline:
    prompt = generate_course_prompt(topic)
    return _generate_gemini_json(
        prompt=prompt,
        parse_response=parse_course_outline,
        log_label="course outline",
        failure_message="Gemini failed to generate a valid course outline.",
    )


def generate_lesson_for_user(
    *,
    lesson_id: UUID,
    user: Any,
    regenerate: bool = False,
) -> Lesson:
    lesson = Lesson.objects.select_related(
        "module",
        "module__course",
        "module__course__creator",
    ).get(pk=lesson_id, module__course__creator=user)

    if lesson.is_enriched and not regenerate:
        return lesson

    lesson_content = generate_lesson_content(lesson=lesson)
    return enrich_lesson_from_content(lesson=lesson, lesson_content=lesson_content)


def generate_lesson_content(*, lesson: Lesson) -> LessonContent:
    prompt = generate_lesson_prompt(
        course_title=lesson.module.course.title,
        module_title=lesson.module.title,
        lesson_title=lesson.title,
    )
    return _generate_gemini_json(
        prompt=prompt,
        parse_response=parse_lesson_content,
        log_label="lesson content",
        failure_message="Gemini failed to generate valid lesson content.",
    )


def enrich_lesson_from_content(
    *,
    lesson: Lesson,
    lesson_content: LessonContent,
) -> Lesson:
    with transaction.atomic():
        locked_lesson = Lesson.objects.select_related(
            "module",
            "module__course",
        ).select_for_update().get(pk=lesson.pk)
        locked_lesson.objectives = lesson_content["objectives"]
        locked_lesson.content = lesson_content["content"]
        locked_lesson.is_enriched = True
        locked_lesson.save(update_fields=["objectives", "content", "is_enriched"])

    logger.info("Generated lesson content %s.", locked_lesson.pk)
    return locked_lesson


def _generate_gemini_json(
    *,
    prompt: str,
    parse_response: Callable[[str], Any],
    log_label: str,
    failure_message: str,
) -> Any:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY is not configured.")
        raise GeminiConfigurationError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)
    model = os.getenv("GEMINI_MODEL", DEFAULT_GEMINI_MODEL)

    for attempt in range(1, MAX_GEMINI_ATTEMPTS + 1):
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4,
                ),
            )
            response_text = getattr(response, "text", "")
            if not response_text:
                raise GeminiServiceError("Gemini returned an empty response.")
            return parse_response(response_text)
        except errors.ClientError as exc:
            if exc.code == 404:
                logger.error("Gemini model %s is not available.", model, exc_info=True)
                raise GeminiConfigurationError(
                    f"Gemini model '{model}' is not available."
                ) from exc
            logger.warning(
                "Gemini %s attempt %s/%s failed (code=%s).",
                log_label,
                attempt,
                MAX_GEMINI_ATTEMPTS,
                exc.code,
                exc_info=True,
            )
            if attempt == MAX_GEMINI_ATTEMPTS:
                raise GeminiServiceError(failure_message) from exc
            # Free-tier 429s often ask ~30s; short backoff just burns attempts.
            sleep_seconds = 35 if exc.code == 429 else 2 ** (attempt - 1)
            time.sleep(sleep_seconds)
        except Exception as exc:
            logger.warning(
                "Gemini %s attempt %s/%s failed.",
                log_label,
                attempt,
                MAX_GEMINI_ATTEMPTS,
                exc_info=True,
            )
            if attempt == MAX_GEMINI_ATTEMPTS:
                raise GeminiServiceError(failure_message) from exc
            time.sleep(2 ** (attempt - 1))

    raise GeminiServiceError(failure_message)


def enqueue_lesson_enrichment(lesson_id: UUID) -> None:
    from .tasks import enrich_lesson_task

    enrich_lesson_task.delay(str(lesson_id))


def enqueue_unenriched_lesson_ids(lesson_ids: list[UUID]) -> None:
    for lesson_id in lesson_ids:
        enqueue_lesson_enrichment(lesson_id)


def enqueue_unenriched_lessons_for_course(*, course: Course) -> None:
    lesson_ids = list(
        Lesson.objects.filter(
            module__course=course,
            is_enriched=False,
        ).values_list("id", flat=True)
    )
    enqueue_unenriched_lesson_ids(lesson_ids)


def create_course_from_outline(
    *,
    topic: str,
    user: Any,
    outline: CourseOutline,
) -> Course:
    lesson_ids: list[UUID] = []

    with transaction.atomic():
        course = Course.objects.create(
            creator=user,
            title=outline["title"],
            description=outline.get("description", ""),
            prompt=topic,
        )

        for module_order, module_data in enumerate(outline["modules"], start=1):
            module = Module.objects.create(
                course=course,
                title=module_data["title"],
                order=module_order,
            )
            for lesson_order, lesson_data in enumerate(
                module_data["lessons"],
                start=1,
            ):
                lesson = Lesson.objects.create(
                    module=module,
                    title=lesson_data["title"],
                    objectives=[],
                    content=[],
                    is_enriched=False,
                    order=lesson_order,
                )
                lesson_ids.append(lesson.pk)

        transaction.on_commit(
            lambda ids=list(lesson_ids): enqueue_unenriched_lesson_ids(ids)
        )

    logger.info("Generated course outline %s for user %s.", course.pk, user.pk)
    return course
