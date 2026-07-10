import uuid

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models


class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="courses",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    prompt = models.TextField()
    tags = ArrayField(
        models.CharField(max_length=100),
        blank=True,
        default=list,
    )
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="modules",
    )
    title = models.CharField(max_length=255)
    order = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(
                fields=["course", "order"],
                name="unique_module_order_per_course",
            ),
        ]

    def __str__(self):
        return self.title


class Lesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="lessons",
    )
    title = models.CharField(max_length=255)
    objectives = models.JSONField(default=list)
    content = models.JSONField(default=list)
    is_enriched = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(
                fields=["module", "order"],
                name="unique_lesson_order_per_module",
            ),
        ]

    def __str__(self):
        return self.title
