from django.contrib.auth import authenticate
from rest_framework_simplejwt.exceptions import TokenError
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


def blacklist_refresh_token(refresh_token):
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except TokenError:
        return False

    return True


def update_user_profile(user, **profile_data):
    for field, value in profile_data.items():
        setattr(user, field, value)

    update_fields = [*profile_data.keys(), "updated_at"]
    user.save(update_fields=update_fields)
    return user
