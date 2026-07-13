from rest_framework import serializers

from .models import Course, Lesson, Module


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


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = (
            "id",
            "course",
            "title",
            "order",
            "created_at",
        )
        read_only_fields = ("id", "course", "order", "created_at")


class ModuleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = (
            "id",
            "title",
            "order",
            "created_at",
        )
        read_only_fields = ("id", "order", "created_at")


class LessonSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = (
            "id",
            "title",
            "order",
            "is_enriched",
        )


class ModuleWithLessonSummariesSerializer(serializers.ModelSerializer):
    lessons = LessonSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = (
            "id",
            "title",
            "order",
            "created_at",
            "lessons",
        )
        read_only_fields = fields


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = (
            "id",
            "module",
            "title",
            "objectives",
            "content",
            "is_enriched",
            "order",
            "created_at",
        )
        read_only_fields = ("id", "module", "order", "created_at")


class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = (
            "id",
            "title",
            "objectives",
            "content",
            "is_enriched",
            "order",
            "created_at",
        )
        read_only_fields = ("id", "order", "created_at")


class ExploreCourseDetailSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)
    modules = ModuleWithLessonSummariesSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "creator",
            "title",
            "description",
            "tags",
            "is_public",
            "created_at",
            "updated_at",
            "modules",
        )
        read_only_fields = fields
