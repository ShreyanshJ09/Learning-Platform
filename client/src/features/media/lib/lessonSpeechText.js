import { htmlToPlainText } from '@/lib/htmlToMarkdown'

/** Backend TTS max length (apps.media.services.tts.MAX_TEXT_LENGTH). */
export const TTS_MAX_TEXT_LENGTH = 4000

/**
 * Build a speakable plain-text script from a lesson (title, objectives, prose).
 * Skips code / video / MCQ blocks. Truncates to the API limit.
 *
 * @param {{
 *   title?: string,
 *   objectives?: string[],
 *   content?: unknown,
 * }} lesson
 * @param {{ maxLength?: number }} [options]
 * @returns {string}
 */
export function buildLessonSpeechText(lesson, { maxLength = TTS_MAX_TEXT_LENGTH } = {}) {
  const parts = []

  if (typeof lesson?.title === 'string' && lesson.title.trim()) {
    parts.push(htmlToPlainText(lesson.title))
  }

  const objectives = Array.isArray(lesson?.objectives)
    ? lesson.objectives
        .filter((item) => typeof item === 'string' && item.trim())
        .map((item) => htmlToPlainText(item))
        .filter(Boolean)
    : []

  if (objectives.length > 0) {
    parts.push(`Objectives. ${objectives.join('. ')}.`)
  }

  const content = Array.isArray(lesson?.content) ? lesson.content : []
  for (const block of content) {
    if (!block || typeof block !== 'object') continue
    const type = block.type
    if (type !== 'heading' && type !== 'paragraph') continue
    if (typeof block.text !== 'string' || !block.text.trim()) continue
    parts.push(htmlToPlainText(block.text))
  }

  let text = parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
  if (text.length > maxLength) {
    text = `${text.slice(0, maxLength - 1).trimEnd()}…`
  }
  return text
}
