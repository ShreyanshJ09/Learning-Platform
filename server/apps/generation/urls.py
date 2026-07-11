from django.urls import path

from .views import GenerateCourseView, GenerateLessonView

app_name = "generation"

urlpatterns = [
    path("course/", GenerateCourseView.as_view(), name="generate-course"),
    path("lesson/<uuid:lesson_id>/", GenerateLessonView.as_view(), name="generate-lesson"),
]
