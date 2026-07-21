import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Interactive MCQ block. Selection state is local to this block only.
 * After a choice: show correct/incorrect styling + explanation.
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function McqBlock({ block, index, className }) {
  const groupId = useId()
  const [selected, setSelected] = useState(null)

  const question = typeof block.question === 'string' ? block.question : ''
  const options = Array.isArray(block.options) ? block.options : []
  const answerIndex =
    typeof block.answer === 'number' && Number.isInteger(block.answer)
      ? block.answer
      : -1
  const explanation =
    typeof block.explanation === 'string' ? block.explanation : ''

  const hasAnswered = selected !== null
  const isCorrect = hasAnswered && selected === answerIndex

  return (
    <fieldset
      className={cn(
        'rounded-xl bg-card px-4 py-4 ring-1 ring-foreground/10',
        className,
      )}
    >
      <legend className="mb-3 font-heading text-base font-medium text-foreground">
        {question || `Question ${index + 1}`}
      </legend>

      <div
        role="radiogroup"
        aria-label={question || 'Multiple choice options'}
        className="flex flex-col gap-2"
      >
        {options.map((option, optionIndex) => {
          const optionId = `${groupId}-option-${optionIndex}`
          const isSelected = selected === optionIndex
          const showCorrect = hasAnswered && optionIndex === answerIndex
          const showIncorrect =
            hasAnswered && isSelected && optionIndex !== answerIndex

          return (
            <label
              key={optionId}
              htmlFor={optionId}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ring-1 ring-transparent',
                !hasAnswered && 'hover:bg-muted/60',
                isSelected && !hasAnswered && 'bg-muted/60 ring-foreground/10',
                showCorrect && 'bg-emerald-500/10 ring-emerald-500/30',
                showIncorrect && 'bg-destructive/10 ring-destructive/30',
                hasAnswered && 'cursor-default',
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={optionIndex}
                checked={isSelected}
                disabled={hasAnswered}
                onChange={() => setSelected(optionIndex)}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span
                className={cn(
                  'min-w-0 flex-1 text-foreground',
                  showCorrect && 'font-medium',
                )}
              >
                {option}
              </span>
            </label>
          )
        })}
      </div>

      {hasAnswered ? (
        <div
          className={cn(
            'mt-3 rounded-lg px-3 py-2 text-sm',
            isCorrect
              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : 'bg-destructive/10 text-destructive',
          )}
          role="status"
        >
          <p className="font-medium">
            {isCorrect ? 'Correct' : 'Not quite'}
          </p>
          {explanation ? (
            <p className="mt-1 text-muted-foreground">{explanation}</p>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  )
}
