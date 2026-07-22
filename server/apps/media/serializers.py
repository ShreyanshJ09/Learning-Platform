from rest_framework import serializers


class YouTubeVideoSerializer(serializers.Serializer):
    video_id = serializers.CharField()
    title = serializers.CharField()
    thumbnail = serializers.URLField()


class TTSRequestSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=4000, trim_whitespace=True)
    language = serializers.CharField(
        required=False,
        allow_blank=True,
        default="en",
        max_length=32,
    )
