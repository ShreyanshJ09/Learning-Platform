import { htmlToPlainText } from '@/lib/htmlToMarkdown'
import { cn } from '@/lib/utils'

/**
 * Renders a heading content block.
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function HeadingBlock({ block, className }) {
  const text = htmlToPlainText(typeof block.text === 'string' ? block.text : '')

  return (
    <h2
      className={cn(
        'font-heading text-xl font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      {text}
    </h2>
  )
}
