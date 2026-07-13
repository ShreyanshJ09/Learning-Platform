from django.urls import path

from .views import CourseProgressView, LessonCompleteView

app_name = "progress"

urlpatterns = [
    path(
        "lessons/<uuid:lesson_id>/complete/",
        LessonCompleteView.as_view(),
        name="lesson-complete",
    ),
    path(
        "courses/<uuid:course_id>/",
        CourseProgressView.as_view(),
        name="course-progress",
    ),
]
