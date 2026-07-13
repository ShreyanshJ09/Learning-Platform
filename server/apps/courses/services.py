from django.db import transaction
from django.db.models import Max, Q

from .models import Course, Lesson, Module


def create_module_for_course(*, serializer, course):
    with transaction.atomic():
        locked_course = Course.objects.select_for_update().get(pk=course.pk)
        max_order = (
            Module.objects.filter(course=locked_course)
            .aggregate(max_order=Max("order"))
            .get("max_order")
            or 0
        )
        return serializer.save(course=locked_course, order=max_order + 1)


def create_lesson_for_module(*, serializer, module):
    with transaction.atomic():
        locked_module = Module.objects.select_for_update().get(pk=module.pk)
        max_order = (
            Lesson.objects.filter(module=locked_module)
            .aggregate(max_order=Max("order"))
            .get("max_order")
            or 0
        )
        return serializer.save(module=locked_module, order=max_order + 1)


def list_public_courses(*, q=None, tags=None):
    queryset = Course.objects.filter(is_public=True).select_related("creator")

    if q:
        queryset = queryset.filter(
            Q(title__icontains=q) | Q(description__icontains=q)
        )

    if tags:
        for tag in tags:
            queryset = queryset.filter(tags__contains=[tag])

    return queryset.order_by("-created_at")


def get_public_course(*, course_id):
    return (
        Course.objects.filter(is_public=True, pk=course_id)
        .select_related("creator")
        .prefetch_related("modules__lessons")
        .first()
    )
