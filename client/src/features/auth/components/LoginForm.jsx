import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { loginSchema } from '@/features/auth/schemas'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizeApiError } from '@/lib/errors'
import { paths } from '@/routes/paths'
import { getSafeNextPath } from '@/features/auth/getSafeNextPath'

export function LoginForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutateAsync, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    clearErrors('root')
    try {
      await mutateAsync(values)
      navigate(getSafeNextPath(searchParams.get('next')), { replace: true })
    } catch (err) {
      const apiError = normalizeApiError(err)
      setError('root', { type: 'server', message: apiError.message })
    }
  }

  return (
    <AuthCard
      title="Log in"
      description="Sign in with your email and password."
      footer={
        <p className="text-sm text-muted-foreground">
          No account?{' '}
          <Link
            to={paths.register}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Register
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
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
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
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            disabled={isPending}
            {...register('password')}
          />
          {errors.password?.message ? (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isPending} size="lg">
          {isPending ? (
            <>
              <Loader2 className="animate-spin" data-icon="inline-start" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
