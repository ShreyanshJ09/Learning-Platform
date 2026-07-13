from django.shortcuts import get_object_or_404
from django.utils import timezone

from apps.courses.models import Course, Lesson

from .models import UserProgress


def mark_lesson_complete(*, user, lesson_id):
    lesson = get_object_or_404(Lesson, pk=lesson_id)
    progress, _created = UserProgress.objects.get_or_create(
        user=user,
        lesson=lesson,
    )
    progress.completed = True
    progress.completed_at = timezone.now()
    progress.save(update_fields=["completed", "completed_at"])
    return progress


def unmark_lesson_complete(*, user, lesson_id):
    lesson = get_object_or_404(Lesson, pk=lesson_id)
    UserProgress.objects.filter(user=user, lesson=lesson).delete()


def get_course_progress(*, user, course_id):
    course = get_object_or_404(Course, pk=course_id)
    total = Lesson.objects.filter(module__course=course).count()
    completed = UserProgress.objects.filter(
        user=user,
        lesson__module__course=course,
        completed=True,
    ).count()
    percentage = round((completed / total) * 100) if total else 0
    return {
        "total": total,
        "completed": completed,
        "percentage": percentage,
    }
