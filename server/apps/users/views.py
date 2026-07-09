from rest_framework import generics, serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    MeSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .services import (
    authenticate_user_by_email,
    blacklist_refresh_token,
    get_tokens_for_user,
)


class RegisterView(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate_user_by_email(**serializer.validated_data)

        if user is None:
            raise serializers.ValidationError(
                {"detail": "Invalid email or password."}
            )

        tokens = get_tokens_for_user(user)
        return Response(
            {
                **tokens,
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class MeView(generics.RetrieveUpdateAPIView):
    http_method_names = ["get", "patch", "head", "options"]
    serializer_class = MeSerializer

    def get_object(self):
        return self.request.user


class LogoutView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        was_blacklisted = blacklist_refresh_token(
            serializer.validated_data["refresh"]
        )
        if not was_blacklisted:
            raise serializers.ValidationError(
                {"refresh": "Invalid or expired refresh token."}
            )

        return Response(status=status.HTTP_204_NO_CONTENT)
