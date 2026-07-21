def generate_course_prompt(topic: str) -> str:
    return f"""
Create a beginner-friendly course outline for this topic:

{topic}

Return only valid JSON. Do not wrap the response in markdown.

The JSON must match this exact shape:
{{
  "title": "Course title",
  "description": "Short course description",
  "modules": [
    {{
      "title": "Module title",
      "lessons": [
        {{"title": "Lesson title"}}
      ]
    }}
  ]
}}

Rules:
- Create 4 to 6 modules.
- Create 3 to 5 lessons per module.
- Keep lesson titles concise.
- Do not generate lesson objectives or lesson content.
- Do not include IDs, order values, markdown, comments, or extra keys.
""".strip()


def generate_lesson_prompt(*, course_title: str, module_title: str, lesson_title: str) -> str:
    return f"""
Create a complete lesson for this course outline item:

Course: {course_title}
Module: {module_title}
Lesson: {lesson_title}

Return only valid JSON. Do not wrap the response in markdown.

The JSON must match this exact shape:
{{
  "objectives": [
    "Objective text"
  ],
  "content": [
    {{"type": "heading", "text": "Section title"}},
    {{"type": "paragraph", "text": "Lesson explanation"}},
    {{"type": "code", "language": "python", "text": "print('hello')"}},
    {{"type": "video", "query": "YouTube search query"}},
    {{
      "type": "mcq",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "Why this answer is correct"
    }}
  ]
}}

Rules:
- Include 3 to 5 objectives.
- Include useful headings and paragraphs.
- Include code blocks only when the lesson benefits from code.
- Include 1 to 2 video query blocks.
- Include 4 to 5 MCQ blocks.
- MCQ answer must be a zero-based integer index into options.
- Paragraph, heading, objective, and MCQ text may use Markdown only
  (e.g. **bold**, *italic*, - bullet lists, 1. numbered lists).
- Never use HTML tags in any text field (no <b>, <ul>, <li>, <p>, <br>, etc.).
- Do not include IDs, comments, or extra top-level keys.
""".strip()
