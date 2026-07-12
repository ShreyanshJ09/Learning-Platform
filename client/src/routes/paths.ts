/**
 * Typed route path constants / builders.
 * Always navigate with these — never hard-code path strings in components.
 */
export const paths = {
  landing: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  createCourse: "/courses/new",
  course: (courseId: string) => `/courses/${courseId}`,
  lesson: (courseId: string, lessonId: string) =>
    `/courses/${courseId}/lessons/${lessonId}`,
  profile: "/profile",
} as const;
