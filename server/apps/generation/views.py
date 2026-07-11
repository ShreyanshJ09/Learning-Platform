import logging

from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.serializers import CourseSerializer, LessonSerializer

from .exceptions import CourseGenerationError, GeminiConfigurationError
from .serializers import GenerateCourseSerializer, GenerateLessonSerializer
from .services import generate_course_for_user, generate_lesson_for_user

logger = logging.getLogger(__name__)


class GenerateCourseView(APIView):
    def post(self, request):
        serializer = GenerateCourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        topic = serializer.validated_data["topic"]

        try:
            course = generate_course_for_user(topic=topic, user=request.user)
        except GeminiConfigurationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except CourseGenerationError:
            logger.exception("Course generation failed for user %s.", request.user.pk)
            return Response(
                {"detail": "Unable to generate a course outline right now."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            CourseSerializer(course).data,
            status=status.HTTP_201_CREATED,
        )


class GenerateLessonView(APIView):
    def post(self, request, lesson_id):
        serializer = GenerateLessonSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            lesson = generate_lesson_for_user(
                lesson_id=lesson_id,
                user=request.user,
                regenerate=serializer.validated_data["regenerate"],
            )
        except ObjectDoesNotExist:
            raise Http404
        except GeminiConfigurationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except CourseGenerationError:
            logger.exception("Lesson generation failed for user %s.", request.user.pk)
            return Response(
                {"detail": "Unable to generate lesson content right now."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(LessonSerializer(lesson).data, status=status.HTTP_200_OK)
