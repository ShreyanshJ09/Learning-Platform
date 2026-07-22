from django.test import SimpleTestCase

from apps.generation.html_to_markdown import html_to_markdown
from apps.generation.parser import parse_lesson_content


class HtmlToMarkdownTests(SimpleTestCase):
    def test_bold_tags_become_markdown(self):
        result = html_to_markdown("<b>Abundance of Data:</b> We live in an era.")
        self.assertEqual(result, "**Abundance of Data:** We live in an era.")

    def test_list_html_becomes_markdown(self):
        result = html_to_markdown(
            "<ul><li><b>Healthcare:</b> Diagnosis.</li>"
            "<li><b>Finance:</b> Fraud.</li></ul>"
        )
        self.assertIn("- **Healthcare:** Diagnosis.", result)
        self.assertIn("- **Finance:** Fraud.", result)
        self.assertNotIn("<", result)

    def test_plain_markdown_unchanged(self):
        source = "**Already bold** and a list:\n- one\n- two"
        self.assertEqual(html_to_markdown(source), source)


class ParseLessonContentHtmlTests(SimpleTestCase):
    def test_paragraph_html_normalized_on_parse(self):
        raw = """
        {
          "objectives": ["Learn <b>ML</b> basics"],
          "content": [
            {"type": "heading", "text": "<b>Why ML matters</b>"},
            {
              "type": "paragraph",
              "text": "<b>Abundance of Data:</b> Big data fuels models."
            },
            {
              "type": "mcq",
              "question": "What is <b>ML</b>?",
              "options": ["A", "B"],
              "answer": 0,
              "explanation": "Because <b>A</b>."
            }
          ]
        }
        """
        parsed = parse_lesson_content(raw)
        self.assertEqual(parsed["objectives"][0], "Learn **ML** basics")
        self.assertEqual(parsed["content"][0]["text"], "**Why ML matters**")
        self.assertEqual(
            parsed["content"][1]["text"],
            "**Abundance of Data:** Big data fuels models.",
        )
        self.assertEqual(parsed["content"][2]["question"], "What is **ML**?")
        self.assertEqual(parsed["content"][2]["explanation"], "Because **A**.")
