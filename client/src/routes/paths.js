export const paths = {
  landing: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  createCourse: '/courses/new',
  course: (courseId) => `/courses/${courseId}`,
  lesson: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,
  profile: '/profile',
}
