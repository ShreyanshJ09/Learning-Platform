class MediaServiceError(Exception):
    """Base exception for media service failures."""


class YouTubeConfigurationError(MediaServiceError):
    """Raised when YouTube is not configured correctly."""


class YouTubeServiceError(MediaServiceError):
    """Raised when YouTube cannot return a usable response."""


class TTSConfigurationError(MediaServiceError):
    """Raised when TTS is not configured correctly."""


class TTSServiceError(MediaServiceError):
    """Raised when TTS cannot return usable audio."""
