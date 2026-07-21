/**
 * JSDoc typedefs for lesson content blocks.
 * Documentation / editor autocomplete only — runtime validation lives in schemas.js.
 *
 * Import in other files via:
 *   `@typedef {import('@/features/lessons/types.js').ContentBlock} ContentBlock`
 *
 * @typedef {{ type: 'heading', text: string }} HeadingBlock
 * @typedef {{ type: 'paragraph', text: string }} ParagraphBlock
 * @typedef {{ type: 'code', language: string, text: string }} CodeBlock
 * @typedef {{ type: 'video', query: string }} VideoBlock
 * @typedef {{
 *   type: 'mcq',
 *   question: string,
 *   options: string[],
 *   answer: number,
 *   explanation: string,
 * }} McqBlock
 * @typedef {HeadingBlock | ParagraphBlock | CodeBlock | VideoBlock | McqBlock} ContentBlock
 * @typedef {{ type: string, [key: string]: unknown }} UnknownBlock
 */

export {}
