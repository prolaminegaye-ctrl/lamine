export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'student' | 'instructor' | 'admin'
  bio: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
}

export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  instructor_id: string
  category_id: string | null
  price: number
  level: 'beginner' | 'intermediate' | 'advanced'
  language: string
  status: 'draft' | 'published' | 'archived'
  duration_minutes: number | null
  created_at: string
  instructor?: Profile
  category?: Category
  enrollments?: { count: number }[]
  modules?: Module[]
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content_type: 'video' | 'pdf' | 'scorm' | 'h5p' | 'text' | 'quiz'
  content_url: string | null
  content_body: string | null
  duration_minutes: number | null
  order_index: number
  is_free_preview: boolean
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  progress_percent: number
  completed_at: string | null
  enrolled_at: string
  course?: Course
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number | null
  time_spent_seconds: number
  updated_at: string
}
