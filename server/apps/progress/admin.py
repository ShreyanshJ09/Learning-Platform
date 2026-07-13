from django.contrib import admin

from .models import UserCourse, UserProgress


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "completed", "completed_at")
    search_fields = (
        "user__username",
        "user__email",
        "lesson__title",
    )
    list_filter = ("completed", "completed_at")
    readonly_fields = ("completed_at",)


@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "saved_at")
    search_fields = (
        "user__username",
        "user__email",
        "course__title",
    )
    list_filter = ("saved_at",)
    readonly_fields = ("saved_at",)
