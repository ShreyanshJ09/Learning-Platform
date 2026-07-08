from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser


def create_user(*, email, username, password):
    return CustomUser.objects.create_user(
        email=email,
        username=username,
        password=password,
    )


def authenticate_user_by_email(*, email, password):
    user = CustomUser.objects.filter(email__iexact=email).first()
    if user is None:
        return None

    return authenticate(username=user.get_username(), password=password)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
