from .models import CustomUser


def create_user(*, email, username, password):
    return CustomUser.objects.create_user(
        email=email,
        username=username,
        password=password,
    )
