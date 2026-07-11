import json
from typing import Any, Dict, List

from .exceptions import OutlineParseError


CourseOutline = Dict[str, Any]
LessonContent = Dict[str, Any]


def parse_course_outline(raw_response: str) -> CourseOutline:
    try:
        payload = json.loads(_strip_json_fence(raw_response))
    except json.JSONDecodeError as exc:
        raise OutlineParseError("Gemini returned invalid JSON.") from exc

    if not isinstance(payload, dict):
        raise OutlineParseError("Course outline must be a JSON object.")

    title = _required_string(payload, "title")
    description = payload.get("description", "")
    if description is None:
        description = ""
    if not isinstance(description, str):
        raise OutlineParseError("Course description must be a string.")

    modules = payload.get("modules")
    if not isinstance(modules, list) or not modules:
        raise OutlineParseError("Course outline must include at least one module.")

    parsed_modules = [_parse_module(module) for module in modules]

    return {
        "title": title,
        "description": description.strip(),
        "modules": parsed_modules,
    }


def parse_lesson_content(raw_response: str) -> LessonContent:
    try:
        payload = json.loads(_strip_json_fence(raw_response))
    except json.JSONDecodeError as exc:
        raise OutlineParseError("Gemini returned invalid JSON.") from exc

    if not isinstance(payload, dict):
        raise OutlineParseError("Lesson content must be a JSON object.")

    objectives = payload.get("objectives")
    if not isinstance(objectives, list) or not objectives:
        raise OutlineParseError("Lesson content must include objectives.")

    parsed_objectives = []
    for objective in objectives:
        if not isinstance(objective, str) or not objective.strip():
            raise OutlineParseError("Each objective must be a non-empty string.")
        parsed_objectives.append(objective.strip())

    content = payload.get("content")
    if not isinstance(content, list) or not content:
        raise OutlineParseError("Lesson content must include content blocks.")

    return {
        "objectives": parsed_objectives,
        "content": [_parse_content_block(block) for block in content],
    }


def _parse_module(module: Any) -> Dict[str, Any]:
    if not isinstance(module, dict):
        raise OutlineParseError("Each module must be a JSON object.")

    title = _required_string(module, "title")
    lessons = module.get("lessons")
    if not isinstance(lessons, list) or not lessons:
        raise OutlineParseError("Each module must include at least one lesson.")

    return {
        "title": title,
        "lessons": [_parse_lesson(lesson) for lesson in lessons],
    }


def _parse_lesson(lesson: Any) -> Dict[str, str]:
    if not isinstance(lesson, dict):
        raise OutlineParseError("Each lesson must be a JSON object.")

    return {"title": _required_string(lesson, "title")}


def _parse_content_block(block: Any) -> Dict[str, Any]:
    if not isinstance(block, dict):
        raise OutlineParseError("Each content block must be a JSON object.")

    block_type = _required_string(block, "type")
    if block_type == "heading":
        return _parse_heading_block(block)
    if block_type == "paragraph":
        return _parse_paragraph_block(block)
    if block_type == "code":
        return _parse_code_block(block)
    if block_type == "video":
        return _parse_video_block(block)
    if block_type == "mcq":
        return _parse_mcq_block(block)

    raise OutlineParseError(f"Unsupported content block type '{block_type}'.")


def _parse_heading_block(block: Dict[str, Any]) -> Dict[str, str]:
    return {
        "type": "heading",
        "text": _required_string(block, "text"),
    }


def _parse_paragraph_block(block: Dict[str, Any]) -> Dict[str, str]:
    return {
        "type": "paragraph",
        "text": _required_string(block, "text"),
    }


def _parse_code_block(block: Dict[str, Any]) -> Dict[str, str]:
    return {
        "type": "code",
        "language": _required_string(block, "language"),
        "text": _required_string(block, "text"),
    }


def _parse_video_block(block: Dict[str, Any]) -> Dict[str, str]:
    return {
        "type": "video",
        "query": _required_string(block, "query"),
    }


def _parse_mcq_block(block: Dict[str, Any]) -> Dict[str, Any]:
    question = _required_string(block, "question")
    options = block.get("options")
    if not isinstance(options, list) or len(options) < 2:
        raise OutlineParseError("MCQ blocks must include at least two options.")

    parsed_options = []
    for option in options:
        if not isinstance(option, str) or not option.strip():
            raise OutlineParseError("Each MCQ option must be a non-empty string.")
        parsed_options.append(option.strip())

    answer = block.get("answer")
    if not isinstance(answer, int) or answer < 0 or answer >= len(parsed_options):
        raise OutlineParseError("MCQ answer must be a valid zero-based option index.")

    return {
        "type": "mcq",
        "question": question,
        "options": parsed_options,
        "answer": answer,
        "explanation": _required_string(block, "explanation"),
    }


def _required_string(payload: Dict[str, Any], field_name: str) -> str:
    value = payload.get(field_name)
    if not isinstance(value, str) or not value.strip():
        raise OutlineParseError(f"Missing or invalid '{field_name}'.")
    return value.strip()


def _strip_json_fence(raw_response: str) -> str:
    text = raw_response.strip()
    if not text.startswith("```"):
        return text

    lines: List[str] = text.splitlines()
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]
    return "\n".join(lines).strip()
