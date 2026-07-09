from rest_framework import viewsets

from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.select_related("creator").filter(
            creator=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
