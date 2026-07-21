import { CodeBlock } from '@/features/lessons/components/blocks/CodeBlock'
import { HeadingBlock } from '@/features/lessons/components/blocks/HeadingBlock'
import { McqBlock } from '@/features/lessons/components/blocks/McqBlock'
import { ParagraphBlock } from '@/features/lessons/components/blocks/ParagraphBlock'
import { VideoBlock } from '@/features/lessons/components/blocks/VideoBlock'

/**
 * Maps each content-block `type` string to its React component.
 * LessonRenderer looks up by type; unregistered types fall back to UnknownBlock.
 * Add new types here only — do not edit LessonRenderer (open/closed).
 *
 * @type {Record<string, import('./types.js').BlockComponent>}
 */
export const blockRegistry = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock,
  mcq: McqBlock,
}
