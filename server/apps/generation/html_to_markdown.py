"""Convert a small set of HTML tags into Markdown (stdlib only).

Lesson paragraphs are rendered as Markdown on the client. Gemini sometimes
emits HTML (<b>, <ul>, …); normalize those to Markdown before storage.
"""

from __future__ import annotations

import html
import re
from html.parser import HTMLParser


_WHITESPACE_RE = re.compile(r"[ \t]+\n")
_MULTI_NEWLINE_RE = re.compile(r"\n{3,}")


class _HtmlToMarkdownParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._parts: list[str] = []
        self._list_stack: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:  # noqa: ARG002
        tag = tag.lower()
        if tag in {"b", "strong"}:
            self._parts.append("**")
        elif tag in {"i", "em"}:
            self._parts.append("*")
        elif tag == "br":
            self._parts.append("\n")
        elif tag == "p":
            if self._parts and not self._parts[-1].endswith("\n"):
                self._parts.append("\n\n")
        elif tag == "ul":
            self._list_stack.append("ul")
            self._parts.append("\n")
        elif tag == "ol":
            self._list_stack.append("ol")
            self._parts.append("\n")
        elif tag == "li":
            marker = "1. " if self._list_stack and self._list_stack[-1] == "ol" else "- "
            if self._parts and not self._parts[-1].endswith("\n"):
                self._parts.append("\n")
            self._parts.append(marker)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in {"b", "strong"}:
            self._parts.append("**")
        elif tag in {"i", "em"}:
            self._parts.append("*")
        elif tag == "p":
            self._parts.append("\n\n")
        elif tag in {"ul", "ol"}:
            if self._list_stack:
                self._list_stack.pop()
            self._parts.append("\n")
        elif tag == "li":
            self._parts.append("\n")

    def handle_data(self, data: str) -> None:
        self._parts.append(data)

    def get_markdown(self) -> str:
        text = "".join(self._parts)
        text = html.unescape(text)
        text = _WHITESPACE_RE.sub("\n", text)
        text = _MULTI_NEWLINE_RE.sub("\n\n", text)
        return text.strip()


def html_to_markdown(value: str) -> str:
    """Convert common inline/list HTML tags to Markdown; strip the rest."""
    if not value or "<" not in value:
        return value

    parser = _HtmlToMarkdownParser()
    try:
        parser.feed(value)
        parser.close()
    except Exception:
        # Malformed HTML — fall back to stripping tags.
        return _strip_tags(value)

    return parser.get_markdown()


def _strip_tags(value: str) -> str:
    without_tags = re.sub(r"<[^>]+>", "", value)
    return html.unescape(without_tags).strip()
