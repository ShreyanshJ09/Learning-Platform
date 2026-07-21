import { cn } from '@/lib/utils'

/**
 * Renders a heading content block.
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function HeadingBlock({ block, className }) {
  return (
    <h2
      className={cn(
        'font-heading text-xl font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      {block.text}
    </h2>
  )
}
