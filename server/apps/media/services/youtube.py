import json
import logging
from datetime import timedelta
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.media.exceptions import YouTubeConfigurationError, YouTubeServiceError
from apps.media.models import VideoCache

logger = logging.getLogger(__name__)

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
CACHE_TTL = timedelta(hours=24)
MAX_RESULTS = 5


def normalize_query(query: str) -> str:
    return " ".join(query.strip().split()).lower()


def thumbnail_url(video_id: str) -> str:
    return f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"


def _serialize_cache_rows(rows):
    return [
        {
            "video_id": row.video_id,
            "title": row.video_title,
            "thumbnail": thumbnail_url(row.video_id),
        }
        for row in rows
    ]


def _get_fresh_cache(normalized_query: str):
    cutoff = timezone.now() - CACHE_TTL
    return list(
        VideoCache.objects.filter(
            query=normalized_query,
            cached_at__gte=cutoff,
        ).order_by("id")
    )


def _fetch_youtube_results(normalized_query: str):
    api_key = getattr(settings, "YOUTUBE_API_KEY", None) or None
    if not api_key:
        raise YouTubeConfigurationError("YOUTUBE_API_KEY is not configured.")

    params = urlencode(
        {
            "part": "snippet",
            "type": "video",
            "maxResults": MAX_RESULTS,
            "q": normalized_query,
            "key": api_key,
        }
    )
    url = f"{YOUTUBE_SEARCH_URL}?{params}"

    try:
        with urlopen(url, timeout=15) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        logger.error("YouTube API HTTP error: %s", exc)
        raise YouTubeServiceError("YouTube search failed.") from exc
    except (URLError, TimeoutError, json.JSONDecodeError) as exc:
        logger.error("YouTube API request failed: %s", exc)
        raise YouTubeServiceError("YouTube search failed.") from exc

    results = []
    for item in payload.get("items", []):
        video_id = (item.get("id") or {}).get("videoId")
        title = (item.get("snippet") or {}).get("title")
        if video_id and title:
            results.append(
                {
                    "video_id": video_id,
                    "title": title,
                    "thumbnail": thumbnail_url(video_id),
                }
            )
    return results


def _replace_cache(normalized_query: str, results):
    with transaction.atomic():
        VideoCache.objects.filter(query=normalized_query).delete()
        VideoCache.objects.bulk_create(
            [
                VideoCache(
                    query=normalized_query,
                    video_id=item["video_id"],
                    video_title=item["title"],
                )
                for item in results
            ]
        )


def search_youtube(*, query: str):
    normalized = normalize_query(query)
    if not normalized:
        return []

    cached = _get_fresh_cache(normalized)
    if cached:
        return _serialize_cache_rows(cached)

    results = _fetch_youtube_results(normalized)
    if results:
        _replace_cache(normalized, results)
    return results
