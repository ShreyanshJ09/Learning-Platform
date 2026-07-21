import { lazy, Suspense } from 'react'
import { cn } from '@/lib/utils'

const ParagraphMarkdown = lazy(() =>
  import('@/features/lessons/components/blocks/ParagraphMarkdown').then(
    (mod) => ({ default: mod.ParagraphMarkdown }),
  ),
)

/**
 * Paragraph content block — markdown via lazy-loaded react-markdown + remark-gfm.
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function ParagraphBlock({ block, className }) {
  const text = typeof block.text === 'string' ? block.text : ''

  if (!text) return null

  return (
    <Suspense
      fallback={
        <p
          className={cn(
            'whitespace-pre-wrap text-sm leading-relaxed text-foreground',
            className,
          )}
        >
          {text}
        </p>
      }
    >
      <ParagraphMarkdown text={text} className={className} />
    </Suspense>
  )
}
