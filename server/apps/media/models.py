from django.db import models


class VideoCache(models.Model):
    query = models.CharField(max_length=500, db_index=True)
    video_id = models.CharField(max_length=50)
    video_title = models.CharField(max_length=500)
    cached_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-cached_at"]

    def __str__(self):
        return f"{self.query} → {self.video_id}"
