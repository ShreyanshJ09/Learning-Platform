from rest_framework import serializers

from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "creator",
            "title",
            "description",
            "prompt",
            "tags",
            "is_public",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "creator", "created_at", "updated_at")
