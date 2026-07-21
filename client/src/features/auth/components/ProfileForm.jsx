import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile'
import { profileSchema } from '@/features/auth/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizeApiError } from '@/lib/errors'
import { cn } from '@/lib/utils'

/**
 * Edit profile form — username, names, profile picture URL.
 * Email is read-only (shown separately on ProfilePage).
 *
 * @param {{ user: object, className?: string }} props
 */
export function ProfileForm({ user, className }) {
  const { mutateAsync, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(user),
  })

  useEffect(() => {
    if (user) {
      reset(toFormValues(user))
      clearErrors()
    }
  }, [user, reset, clearErrors])

  async function onSubmit(values) {
    clearErrors('root')
    try {
      await mutateAsync({
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        profile_picture: values.profile_picture,
      })
    } catch (err) {
      const apiError = normalizeApiError(err)
      const fieldErrors = apiError.fieldErrors

      if (fieldErrors) {
        for (const [key, messages] of Object.entries(fieldErrors)) {
          if (key === 'non_field_errors') continue
          const message = messages?.[0]
          if (message) {
            setError(key, { type: 'server', message })
          }
        }

        const nonField = fieldErrors.non_field_errors?.[0]
        if (nonField) {
          setError('root', { type: 'server', message: nonField })
          return
        }
      }

      setError('root', {
        type: 'server',
        message: apiError.message ?? 'Could not update profile.',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      noValidate
    >
      {errors.root?.message ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="profile-username">Username</Label>
        <Input
          id="profile-username"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          disabled={isPending}
          {...register('username')}
        />
        {errors.username?.message ? (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-first-name">First name</Label>
          <Input
            id="profile-first-name"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.first_name)}
            disabled={isPending}
            {...register('first_name')}
          />
          {errors.first_name?.message ? (
            <p className="text-sm text-destructive">
              {errors.first_name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-last-name">Last name</Label>
          <Input
            id="profile-last-name"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.last_name)}
            disabled={isPending}
            {...register('last_name')}
          />
          {errors.last_name?.message ? (
            <p className="text-sm text-destructive">
              {errors.last_name.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-picture">Profile picture URL</Label>
        <Input
          id="profile-picture"
          type="url"
          placeholder="https://…"
          aria-invalid={Boolean(errors.profile_picture)}
          disabled={isPending}
          {...register('profile_picture')}
        />
        <p className="text-xs text-muted-foreground">
          Optional image URL for your avatar.
        </p>
        {errors.profile_picture?.message ? (
          <p className="text-sm text-destructive">
            {errors.profile_picture.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : (
          'Save changes'
        )}
      </Button>
    </form>
  )
}

function toFormValues(user) {
  return {
    username: user?.username ?? '',
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    profile_picture: user?.profile_picture ?? '',
  }
}
