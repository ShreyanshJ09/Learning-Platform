from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets

from .models import Course, Lesson, Module
from .serializers import (
    CourseSerializer,
    LessonCreateSerializer,
    LessonSerializer,
    LessonSummarySerializer,
    ModuleCreateSerializer,
    ModuleSerializer,
    ModuleWithLessonSummariesSerializer,
)
from .services import create_lesson_for_module, create_module_for_course


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.select_related("creator").filter(
            creator=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class CourseModuleListCreateView(generics.ListCreateAPIView):
    """List or create modules under an owned course."""

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ModuleCreateSerializer
        return ModuleWithLessonSummariesSerializer

    def get_course(self):
        return get_object_or_404(
            Course.objects.filter(creator=self.request.user),
            pk=self.kwargs["course_id"],
        )

    def get_queryset(self):
        course = self.get_course()
        return (
            Module.objects.filter(course=course)
            .prefetch_related("lessons")
        )

    def perform_create(self, serializer):
        create_module_for_course(serializer=serializer, course=self.get_course())


class ModuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an owned module."""

    http_method_names = ["get", "patch", "delete", "head", "options"]
    lookup_url_kwarg = "module_id"

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ModuleWithLessonSummariesSerializer
        return ModuleSerializer

    def get_queryset(self):
        return (
            Module.objects.select_related("course", "course__creator")
            .prefetch_related("lessons")
            .filter(course__creator=self.request.user)
        )


class ModuleLessonListCreateView(generics.ListCreateAPIView):
    """List or create lessons under an owned module."""

    def get_serializer_class(self):
        if self.request.method == "POST":
            return LessonCreateSerializer
        return LessonSummarySerializer

    def get_module(self):
        return get_object_or_404(
            Module.objects.select_related("course", "course__creator").filter(
                course__creator=self.request.user
            ),
            pk=self.kwargs["module_id"],
        )

    def get_queryset(self):
        module = self.get_module()
        return Lesson.objects.select_related("module", "module__course").filter(
            module=module
        )

    def perform_create(self, serializer):
        create_lesson_for_module(serializer=serializer, module=self.get_module())


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an owned lesson."""

    http_method_names = ["get", "patch", "delete", "head", "options"]
    serializer_class = LessonSerializer
    lookup_url_kwarg = "lesson_id"

    def get_queryset(self):
        return Lesson.objects.select_related(
            "module",
            "module__course",
            "module__course__creator",
        ).filter(module__course__creator=self.request.user)
