import { Component } from 'react'
import { cn } from '@/lib/utils'

/**
 * Isolates one content block so a render error can't blank the whole lesson.
 * Class component required — React error boundaries are not available as hooks.
 *
 * @extends {Component<{ index?: number, className?: string, children: import('react').ReactNode }, { hasError: boolean }>}
 */
export class BlockErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error(
        `[BlockErrorBoundary] block index ${this.props.index ?? '?'}`,
        error,
        info?.componentStack,
      )
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <aside
          role="alert"
          className={cn(
            'rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive ring-1 ring-destructive/20',
            this.props.className,
          )}
        >
          This section couldn&apos;t be displayed.
        </aside>
      )
    }

    return this.props.children
  }
}
