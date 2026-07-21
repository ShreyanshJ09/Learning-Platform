import { lazy, Suspense, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/providers/ThemeProvider'
import { cn } from '@/lib/utils'

const CodeHighlighter = lazy(() =>
  import('@/features/lessons/components/blocks/CodeHighlighter').then(
    (mod) => ({ default: mod.CodeHighlighter }),
  ),
)

/**
 * Code content block: language label, copy button, lazy syntax highlighter.
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function CodeBlock({ block, className }) {
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()
  const language = block.language?.trim() || 'text'
  const code = typeof block.text === 'string' ? block.text : ''
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

  async function handleCopy() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard can fail without permission — leave UI unchanged.
    }
  }

  return (
    <figure
      className={cn(
        'overflow-hidden rounded-xl bg-muted/40 ring-1 ring-foreground/10',
        className,
      )}
    >
      <figcaption className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-1.5">
        <span className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </figcaption>

      <Suspense
        fallback={
          <pre className="overflow-x-auto p-3 text-sm leading-relaxed text-foreground">
            <code className="font-mono whitespace-pre">{code}</code>
          </pre>
        }
      >
        <CodeHighlighter code={code} language={language} theme={theme} />
      </Suspense>
    </figure>
  )
}
