from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.progress.views import CourseSaveView, SavedCourseListView

from .views import (
    CourseModuleListCreateView,
    CourseViewSet,
    LessonDetailView,
    ModuleDetailView,
    ModuleLessonListCreateView,
)

app_name = "courses"

router = DefaultRouter()
router.register("courses", CourseViewSet, basename="course")

urlpatterns = [
    path(
        "courses/saved/",
        SavedCourseListView.as_view(),
        name="course-saved-list",
    ),
    path(
        "courses/<uuid:course_id>/save/",
        CourseSaveView.as_view(),
        name="course-save",
    ),
    path(
        "courses/<uuid:course_id>/modules/",
        CourseModuleListCreateView.as_view(),
        name="course-modules",
    ),
    path(
        "modules/<uuid:module_id>/",
        ModuleDetailView.as_view(),
        name="module-detail",
    ),
    path(
        "modules/<uuid:module_id>/lessons/",
        ModuleLessonListCreateView.as_view(),
        name="module-lessons",
    ),
    path(
        "lessons/<uuid:lesson_id>/",
        LessonDetailView.as_view(),
        name="lesson-detail",
    ),
]

urlpatterns += router.urls
