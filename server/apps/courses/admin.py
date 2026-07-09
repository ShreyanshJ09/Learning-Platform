from django.contrib import admin

from .models import Course


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
