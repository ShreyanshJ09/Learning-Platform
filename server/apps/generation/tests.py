from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, TestCase, override_settings

from apps.courses.models import Course, Lesson, Module
from apps.generation.html_to_markdown import html_to_markdown
from apps.generation.parser import parse_lesson_content
from apps.generation.services import create_course_from_outline
from apps.generation.tasks import enrich_lesson_task


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


class EnqueueLessonEnrichmentTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="creator",
            email="creator@example.com",
            password="test-password",
        )

    @patch("apps.generation.tasks.enrich_lesson_task.delay")
    def test_create_course_enqueues_each_stub_lesson(self, mock_delay):
        outline = {
            "title": "Test Course",
            "description": "Desc",
            "modules": [
                {
                    "title": "Module 1",
                    "lessons": [
                        {"title": "Lesson A"},
                        {"title": "Lesson B"},
                    ],
                }
            ],
        }

        # TestCase wraps DB work in a transaction that never commits, so
        # explicitly run on_commit callbacks that enqueue Celery jobs.
        with self.captureOnCommitCallbacks(execute=True):
            course = create_course_from_outline(
                topic="test topic",
                user=self.user,
                outline=outline,
            )

        lesson_ids = list(
            Lesson.objects.filter(module__course=course).values_list("id", flat=True)
        )
        self.assertEqual(len(lesson_ids), 2)
        self.assertEqual(mock_delay.call_count, 2)
        enqueued = {call.args[0] for call in mock_delay.call_args_list}
        self.assertEqual(enqueued, {str(lesson_id) for lesson_id in lesson_ids})


@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class EnrichLessonTaskTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="creator2",
            email="creator2@example.com",
            password="test-password",
        )
        self.course = Course.objects.create(
            creator=self.user,
            title="Course",
            description="",
            prompt="topic",
        )
        self.module = Module.objects.create(
            course=self.course,
            title="Module",
            order=1,
        )

    @patch("apps.generation.services.generate_lesson_content")
    @patch("apps.generation.services.enrich_lesson_from_content")
    def test_skips_when_already_enriched(self, mock_enrich, mock_generate):
        lesson = Lesson.objects.create(
            module=self.module,
            title="Done",
            objectives=["a"],
            content=[{"type": "paragraph", "text": "x"}],
            is_enriched=True,
            order=1,
        )

        result = enrich_lesson_task.run(str(lesson.pk))

        self.assertEqual(result, str(lesson.pk))
        mock_generate.assert_not_called()
        mock_enrich.assert_not_called()

    @patch("apps.generation.services.enrich_lesson_from_content")
    @patch("apps.generation.services.generate_lesson_content")
    def test_enriches_stub_lesson(self, mock_generate, mock_enrich):
        lesson = Lesson.objects.create(
            module=self.module,
            title="Stub",
            objectives=[],
            content=[],
            is_enriched=False,
            order=1,
        )
        lesson_content = {
            "objectives": ["Learn X"],
            "content": [{"type": "paragraph", "text": "Body"}],
        }
        mock_generate.return_value = lesson_content
        mock_enrich.return_value = lesson

        result = enrich_lesson_task.run(str(lesson.pk))

        self.assertEqual(result, str(lesson.pk))
        mock_generate.assert_called_once()
        mock_enrich.assert_called_once()
        self.assertEqual(
            mock_enrich.call_args.kwargs["lesson_content"],
            lesson_content,
        )
