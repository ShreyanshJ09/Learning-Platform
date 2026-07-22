from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .exceptions import (
    TTSConfigurationError,
    TTSServiceError,
    YouTubeConfigurationError,
    YouTubeServiceError,
)
from .serializers import TTSRequestSerializer, YouTubeVideoSerializer
from .services import generate_speech, search_youtube


class YouTubeSearchView(APIView):
    """Search YouTube videos for a lesson video query (cached)."""

    def get(self, request):
        query = request.query_params.get("query", "")
        if not query.strip():
            return Response(
                {"detail": "query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            results = search_youtube(query=query)
        except YouTubeConfigurationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except YouTubeServiceError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            YouTubeVideoSerializer(results, many=True).data,
            status=status.HTTP_200_OK,
        )


class TTSView(APIView):
    """Generate spoken audio for lesson text (streamed WAV, not persisted)."""

    def post(self, request):
        serializer = TTSRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            audio_bytes = generate_speech(
                text=serializer.validated_data["text"],
                language=serializer.validated_data.get("language") or "en",
            )
        except TTSConfigurationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except TTSServiceError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        response = HttpResponse(audio_bytes, content_type="audio/wav")
        response["Content-Disposition"] = 'inline; filename="speech.wav"'
        return response
