import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  'Designing curriculum',
  'Structuring modules',
  'Creating lessons',
]

/**
 * Long-running AI generation indicator — replaces the form while pending.
 * Steps advance on a timer (cosmetic; backend is one long request).
 *
 * @param {{ className?: string }} props
 */
export function GenerationProgress({ className }) {
  const [activeStep, setActiveStep] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion) return undefined

    const timer = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, STEPS.length - 1))
    }, 6_000)

    return () => window.clearInterval(timer)
  }, [reduceMotion])

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center gap-6 rounded-xl bg-card px-6 py-10 text-center ring-1 ring-foreground/10',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Loader2
          className="size-6 motion-reduce:animate-none animate-spin"
          aria-hidden
        />
      </div>

      <div className="space-y-1">
        <h2 className="font-heading text-lg font-medium tracking-tight text-foreground">
          Building your course
        </h2>
        <p className="text-sm text-muted-foreground">
          This can take up to ~30 seconds. Please keep this tab open.
        </p>
      </div>

      <ol className="w-full max-w-sm space-y-2 text-left">
        {STEPS.map((label, index) => {
          const isComplete = !reduceMotion && index < activeStep
          const isCurrent = !reduceMotion && index === activeStep

          return (
            <li
              key={label}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm motion-reduce:transition-none transition-colors',
                isCurrent && 'bg-muted/60 text-foreground',
                isComplete && 'text-muted-foreground',
                !isCurrent && !isComplete && 'text-muted-foreground/60',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full ring-1',
                  isComplete && 'bg-primary/10 text-primary ring-primary/20',
                  isCurrent && 'bg-primary text-primary-foreground ring-primary',
                  !isCurrent && !isComplete && 'bg-muted ring-border',
                )}
                aria-hidden
              >
                {isComplete ? (
                  <Check className="size-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="size-3.5 motion-reduce:animate-none animate-spin" />
                ) : (
                  <span className="size-1.5 rounded-full bg-current opacity-40" />
                )}
              </span>
              <span className={cn(isCurrent && 'font-medium')}>{label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
