from django.urls import path

from .views import ExploreCourseDetailView, ExploreCourseListView

app_name = "explore"

urlpatterns = [
    path(
        "",
        ExploreCourseListView.as_view(),
        name="explore-list",
    ),
    path(
        "<uuid:course_id>/",
        ExploreCourseDetailView.as_view(),
        name="explore-detail",
    ),
]
