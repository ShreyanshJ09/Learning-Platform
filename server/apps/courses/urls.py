from rest_framework.routers import DefaultRouter

from .views import CourseViewSet

app_name = "courses"

router = DefaultRouter()
router.register("courses", CourseViewSet, basename="course")

urlpatterns = router.urls
