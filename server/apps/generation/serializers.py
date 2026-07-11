from rest_framework import serializers


class GenerateCourseSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=500, trim_whitespace=True)

    def validate_topic(self, value: str) -> str:
        if not value.strip():
            raise serializers.ValidationError("Topic is required.")
        return value.strip()


class GenerateLessonSerializer(serializers.Serializer):
    regenerate = serializers.BooleanField(required=False, default=False)
