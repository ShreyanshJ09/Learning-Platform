/**
 * Convert common HTML fragments (often emitted by Gemini) into Markdown
 * so react-markdown can render them. Leaves plain Markdown unchanged.
 *
 * @param {string} value
 * @returns {string}
 */
export function htmlToMarkdown(value) {
  if (typeof value !== 'string' || !value.includes('<')) {
    return value
  }

  let text = value

  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<p[^>]*>/gi, '')
  text = text.replace(/<\/?(?:b|strong)>/gi, '**')
  text = text.replace(/<\/?(?:i|em)>/gi, '*')
  text = text.replace(/<li[^>]*>/gi, '- ')
  text = text.replace(/<\/li>/gi, '\n')
  text = text.replace(/<\/?[uo]l[^>]*>/gi, '\n')
  // Strip any remaining tags (do not render raw HTML).
  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, '')

  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

  return text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

/**
 * HTML → readable plain text (for headings / MCQ / objectives).
 *
 * @param {string} value
 * @returns {string}
 */
export function htmlToPlainText(value) {
  if (typeof value !== 'string') return ''
  return htmlToMarkdown(value)
    .replace(/\*\*/g, '')
    .replace(/(?<!\*)\*(?!\*)/g, '')
    .trim()
}
