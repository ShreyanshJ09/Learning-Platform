from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class AuthProvider(models.TextChoices):
        EMAIL = "EMAIL", "Email"
        GOOGLE = "GOOGLE", "Google"

    email = models.EmailField(unique=True)
    profile_picture = models.URLField(null=True, blank=True)
    auth_provider = models.CharField(
        max_length=20,
        choices=AuthProvider.choices,
        default=AuthProvider.EMAIL,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username
