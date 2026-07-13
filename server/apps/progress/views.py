from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CourseProgressSerializer, LessonCompleteSerializer
from .services import (
    get_course_progress,
    mark_lesson_complete,
    unmark_lesson_complete,
)


class LessonCompleteView(APIView):
    """Mark or unmark a lesson as completed for the current user."""

    def post(self, request, lesson_id):
        progress = mark_lesson_complete(user=request.user, lesson_id=lesson_id)
        return Response(
            LessonCompleteSerializer(progress).data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, lesson_id):
        unmark_lesson_complete(user=request.user, lesson_id=lesson_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CourseProgressView(APIView):
    """Return the current user's completion stats for a course."""

    def get(self, request, course_id):
        stats = get_course_progress(user=request.user, course_id=course_id)
        return Response(
            CourseProgressSerializer(stats).data,
            status=status.HTTP_200_OK,
        )
