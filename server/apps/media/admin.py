from django.contrib import admin

from .models import VideoCache


@admin.register(VideoCache)
class VideoCacheAdmin(admin.ModelAdmin):
    list_display = ("query", "video_id", "video_title", "cached_at")
    search_fields = ("query", "video_id", "video_title")
    list_filter = ("cached_at",)
    readonly_fields = ("cached_at",)
