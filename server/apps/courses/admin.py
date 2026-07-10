from django.contrib import admin

from .models import Course, Lesson, Module


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "creator",
        "is_public",
        "created_at",
        "updated_at",
    )
    search_fields = (
        "title",
        "description",
        "prompt",
        "creator__username",
        "creator__email",
    )
    list_filter = ("is_public", "created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "created_at")
    search_fields = ("title", "course__title")
    list_filter = ("created_at",)
    readonly_fields = ("created_at",)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "order", "is_enriched", "created_at")
    search_fields = ("title", "module__title", "module__course__title")
    list_filter = ("is_enriched", "created_at")
    readonly_fields = ("created_at",)
