import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { htmlToMarkdown } from '@/lib/htmlToMarkdown'
import { cn } from '@/lib/utils'

/**
 * Heavy markdown renderer — lazy-loaded by ParagraphBlock so the chunk
 * only downloads when a lesson with paragraphs is shown.
 *
 * react-markdown does not render raw HTML by default (no rehype-raw),
 * so untrusted lesson text stays relatively safe without rehype-sanitize.
 * Gemini sometimes still emits HTML; htmlToMarkdown normalizes it first.
 *
 * @param {{ text: string, className?: string }} props
 */
export function ParagraphMarkdown({ text, className }) {
  const markdown = htmlToMarkdown(text)

  return (
    <div
      className={cn(
        'text-sm leading-relaxed text-foreground',
        '[&_p]:mb-3 [&_p:last-child]:mb-0',
        '[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:my-1',
        '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        '[&_strong]:font-semibold',
        '[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
        className,
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </div>
  )
}
