from rest_framework import serializers

from .models import UserProgress


class LessonCompleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ("completed", "completed_at")
        read_only_fields = fields


class CourseProgressSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    completed = serializers.IntegerField()
    percentage = serializers.IntegerField()


class CourseSavedSerializer(serializers.Serializer):
    saved = serializers.BooleanField()
