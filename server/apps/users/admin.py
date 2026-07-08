from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "auth_provider",
        "is_staff",
        "is_active",
        "date_joined",
    )
    list_filter = (
        "auth_provider",
        "is_staff",
        "is_active",
        "is_superuser",
        "groups",
    )
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = UserAdmin.fieldsets + (
        ("Profile", {"fields": ("profile_picture", "auth_provider")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Profile",
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "profile_picture",
                    "auth_provider",
                ),
            },
        ),
    )
