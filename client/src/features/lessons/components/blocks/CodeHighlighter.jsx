import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'

/**
 * Heavy syntax highlighter — lazy-loaded by CodeBlock.
 *
 * @param {{
 *   code: string,
 *   language: string,
 *   theme?: 'light' | 'dark',
 *   className?: string,
 * }} props
 */
export function CodeHighlighter({ code, language, theme = 'light', className }) {
  const prismLanguage = normalizeLanguage(language)

  return (
    <div className={cn('overflow-x-auto', className)}>
      <SyntaxHighlighter
        language={prismLanguage}
        style={theme === 'dark' ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: 1.625,
        }}
        codeTagProps={{ className: 'font-mono' }}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

/** Map common aliases to Prism language ids; fall back to plain text. */
function normalizeLanguage(language) {
  const raw = (language || 'text').trim().toLowerCase()
  const aliases = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    yml: 'yaml',
    md: 'markdown',
    plaintext: 'text',
    plain: 'text',
  }
  return aliases[raw] ?? raw
}
