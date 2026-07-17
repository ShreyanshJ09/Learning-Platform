import { cn } from '@/lib/utils'

/**
 * Max-width content wrapper with responsive horizontal padding.
 */
export function Container({ children, className }) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-4 py-6 sm:px-6', className)}>
      {children}
    </div>
  )
}
