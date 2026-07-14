import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { registerSchema } from '@/features/auth/schemas'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizeApiError } from '@/lib/errors'
import { paths } from '@/routes/paths'

/** Map DRF field errors onto RHF fields; otherwise set a root form error. */
function applyServerErrors(setError, apiError, fields) {
  const fieldErrors = apiError.fieldErrors
  let mappedField = false

  if (fieldErrors) {
    for (const [key, messages] of Object.entries(fieldErrors)) {
      if (key === 'non_field_errors') continue
      if (!fields.includes(key)) continue
      const message = messages?.[0]
      if (!message) continue
      setError(key, { type: 'server', message })
      mappedField = true
    }

    const nonField = fieldErrors.non_field_errors?.[0]
    if (nonField) {
      setError('root', { type: 'server', message: nonField })
      return
    }
  }

  if (!mappedField) {
    setError('root', { type: 'server', message: apiError.message })
  }
}

export function RegisterForm() {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useRegister()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    clearErrors('root')
    try {
      await mutateAsync(values)
      navigate(paths.dashboard, { replace: true })
    } catch (err) {
      applyServerErrors(setError, normalizeApiError(err), [
        'email',
        'username',
        'password',
      ])
    }
  }

  return (
    <AuthCard
      title="Create account"
      description="Register with email, username, and a password."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to={paths.login}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errors.root?.message ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errors.root.message}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            disabled={isPending}
            {...register('email')}
          />
          {errors.email?.message ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-username">Username</Label>
          <Input
            id="register-username"
            type="text"
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            disabled={isPending}
            {...register('username')}
          />
          {errors.username?.message ? (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            disabled={isPending}
            {...register('password')}
          />
          {errors.password?.message ? (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              At least 8 characters.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending} size="lg">
          {isPending ? (
            <>
              <Loader2 className="animate-spin" data-icon="inline-start" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
