import base64
import io
import logging
import os
import wave
from typing import Optional

from google import genai
from google.genai import errors
from google.genai import types

from apps.media.exceptions import TTSConfigurationError, TTSServiceError

logger = logging.getLogger(__name__)

DEFAULT_TTS_MODEL = "gemini-2.5-flash-preview-tts"
DEFAULT_TEXT_MODEL = "gemini-2.5-flash"
DEFAULT_VOICE = "Kore"
MAX_TEXT_LENGTH = 4000
HINGLISH_LANGUAGES = {"hinglish", "hi", "hindi"}


def _get_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise TTSConfigurationError("GEMINI_API_KEY is not configured.")
    return genai.Client(api_key=api_key)


def _pcm_to_wav(
    pcm_data: bytes,
    *,
    channels: int = 1,
    sample_width: int = 2,
    sample_rate: int = 24000,
) -> bytes:
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(channels)
        wav_file.setsampwidth(sample_width)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(pcm_data)
    return buffer.getvalue()


def _extract_audio_bytes(response) -> bytes:
    try:
        part = response.candidates[0].content.parts[0]
        data = part.inline_data.data
    except (AttributeError, IndexError, TypeError) as exc:
        raise TTSServiceError("Gemini returned no audio data.") from exc

    if isinstance(data, bytes):
        return data
    if isinstance(data, str):
        return base64.b64decode(data)
    raise TTSServiceError("Gemini returned audio in an unsupported format.")


def _translate_to_hinglish(*, client: genai.Client, text: str) -> str:
    model = os.getenv("GEMINI_MODEL", DEFAULT_TEXT_MODEL)
    prompt = (
        "Translate the following English text into natural Hinglish "
        "(Hindi written in Latin script mixed with English). "
        "Return only the translated text, with no quotes or commentary.\n\n"
        f"{text}"
    )
    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.3),
        )
    except errors.ClientError as exc:
        if exc.status_code == 404:
            raise TTSConfigurationError(
                f"Gemini model '{model}' is not available."
            ) from exc
        raise TTSServiceError("Failed to translate text to Hinglish.") from exc
    except Exception as exc:
        raise TTSServiceError("Failed to translate text to Hinglish.") from exc

    translated = (getattr(response, "text", None) or "").strip()
    if not translated:
        raise TTSServiceError("Gemini returned an empty Hinglish translation.")
    return translated


def _synthesize_speech(*, client: genai.Client, text: str) -> bytes:
    model = os.getenv("GEMINI_TTS_MODEL", DEFAULT_TTS_MODEL)
    voice_name = os.getenv("GEMINI_TTS_VOICE", DEFAULT_VOICE)

    try:
        response = client.models.generate_content(
            model=model,
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice_name,
                        )
                    )
                ),
            ),
        )
    except errors.ClientError as exc:
        if exc.status_code == 404:
            raise TTSConfigurationError(
                f"Gemini TTS model '{model}' is not available."
            ) from exc
        logger.error("Gemini TTS request failed.", exc_info=True)
        raise TTSServiceError("Gemini TTS failed to generate audio.") from exc
    except Exception as exc:
        logger.error("Gemini TTS request failed.", exc_info=True)
        raise TTSServiceError("Gemini TTS failed to generate audio.") from exc

    pcm_data = _extract_audio_bytes(response)
    return _pcm_to_wav(pcm_data)


def generate_speech(*, text: str, language: Optional[str] = None) -> bytes:
    cleaned = " ".join(text.split()).strip()
    if not cleaned:
        raise TTSServiceError("text must not be empty.")
    if len(cleaned) > MAX_TEXT_LENGTH:
        raise TTSServiceError(
            f"text must be at most {MAX_TEXT_LENGTH} characters."
        )

    client = _get_client()
    speak_text = cleaned
    lang = (language or "en").strip().lower()
    if lang in HINGLISH_LANGUAGES:
        speak_text = _translate_to_hinglish(client=client, text=cleaned)

    return _synthesize_speech(client=client, text=speak_text)
