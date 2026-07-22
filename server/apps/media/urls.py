from django.urls import path

from .views import TTSView, YouTubeSearchView

app_name = "media"

urlpatterns = [
    path("youtube/", YouTubeSearchView.as_view(), name="youtube-search"),
    path("tts/", TTSView.as_view(), name="tts"),
]
