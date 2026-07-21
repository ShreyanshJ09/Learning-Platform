import logging

from celery import shared_task
from django.core.exceptions import ObjectDoesNotExist

from apps.courses.models import Lesson

from .exceptions import GeminiConfigurationError, GeminiServiceError

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(GeminiServiceError,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 1},
    rate_limit="2/m",
)
def enrich_lesson_task(self, lesson_id: str):
    """Generate and persist lesson content for a stub lesson."""
    from .services import enrich_lesson_from_content, generate_lesson_content

    try:
        lesson = Lesson.objects.select_related(
            "module",
            "module__course",
        ).get(pk=lesson_id)
    except ObjectDoesNotExist:
        logger.warning("Lesson %s not found; skipping enrichment.", lesson_id)
        return None

    if lesson.is_enriched:
        logger.info("Lesson %s already enriched; skipping.", lesson_id)
        return str(lesson.pk)

    try:
        lesson_content = generate_lesson_content(lesson=lesson)
        enriched = enrich_lesson_from_content(
            lesson=lesson,
            lesson_content=lesson_content,
        )
    except GeminiConfigurationError:
        logger.exception(
            "Gemini is misconfigured; not retrying lesson %s.",
            lesson_id,
        )
        raise

    return str(enriched.pk)
