/**
 * TanStack Query cache key factory.
 *
 * Keys are arrays (React Query's format). Every useQuery / invalidateQueries
 * call must use these — never hardcode ['auth', 'me'] in random files.
 *
 * Phase 2 mainly needs `auth.me`. Course/lesson keys are here so later
 * phases don't invent conflicting key shapes.
 */
export const queryKeys = {
  auth: {
    /** Current user from GET /api/auth/me/ */
    me: ['auth', 'me'],
  },
  courses: {
    all: ['courses'],
    list: () => [...queryKeys.courses.all, 'list'],
    detail: (id) => [...queryKeys.courses.all, 'detail', id],
    modules: (id) => [...queryKeys.courses.all, id, 'modules'],
  },
  modules: {
    detail: (id) => ['modules', 'detail', id],
  },
  lessons: {
    detail: (id) => ['lessons', 'detail', id],
  },
}
