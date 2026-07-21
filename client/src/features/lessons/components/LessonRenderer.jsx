import { BlockErrorBoundary } from '@/features/lessons/components/BlockErrorBoundary'
import { UnknownBlock } from '@/features/lessons/components/blocks/UnknownBlock'
import { blockRegistry } from '@/features/lessons/registry/blockRegistry'
import { lessonContentSchema } from '@/features/lessons/schemas'
import { cn } from '@/lib/utils'

/**
 * Turns a lesson `content[]` array into UI via the block registry.
 * Does not switch on type — lookup + UnknownBlock fallback only.
 * New block types register in blockRegistry; this file stays unchanged.
 *
 * @param {{
 *   content?: unknown,
 *   className?: string,
 * }} props
 */
export function LessonRenderer({ content, className }) {
  const blocks = normalizeContent(content)

  if (blocks.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {blocks.map((block, index) => {
        const Component = blockRegistry[block.type] ?? UnknownBlock

        return (
          <BlockErrorBoundary key={index} index={index}>
            <Component block={block} index={index} />
          </BlockErrorBoundary>
        )
      })}
    </div>
  )
}

/**
 * Validate / coerce content at the render boundary.
 * Known blocks stay strict; unknown or malformed items become loose objects
 * (still renderable via UnknownBlock). Total parse failure → [].
 *
 * @param {unknown} content
 * @returns {Array<{ type: string, [key: string]: unknown }>}
 */
function normalizeContent(content) {
  const result = lessonContentSchema.safeParse(
    Array.isArray(content) ? content : [],
  )

  if (!result.success) {
    if (import.meta.env.DEV) {
      console.warn('[LessonRenderer] invalid lesson content', result.error)
    }
    return []
  }

  return result.data
}
