from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.serializers import CourseSerializer

from .serializers import (
    CourseProgressSerializer,
    CourseSavedSerializer,
    LessonCompleteSerializer,
)
from .services import (
    get_course_progress,
    list_saved_courses,
    mark_lesson_complete,
    save_course,
    unmark_lesson_complete,
    unsave_course,
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


class CourseSaveView(APIView):
    """Save or unsave a course for the current user."""

    def post(self, request, course_id):
        result = save_course(user=request.user, course_id=course_id)
        return Response(
            CourseSavedSerializer(result).data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, course_id):
        unsave_course(user=request.user, course_id=course_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SavedCourseListView(generics.ListAPIView):
    """List courses saved by the current user."""

    serializer_class = CourseSerializer

    def get_queryset(self):
        return list_saved_courses(user=self.request.user)
