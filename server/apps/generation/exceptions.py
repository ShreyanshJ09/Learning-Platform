class CourseGenerationError(Exception):
    """Base exception for course generation failures."""


class GeminiConfigurationError(CourseGenerationError):
    """Raised when Gemini is not configured correctly."""


class GeminiServiceError(CourseGenerationError):
    """Raised when Gemini cannot return a usable response."""


class OutlineParseError(CourseGenerationError):
    """Raised when Gemini returns an invalid course outline."""
