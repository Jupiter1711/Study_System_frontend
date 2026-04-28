export interface Choice {
  id: string
  choice_text: string
  is_correct: boolean
  order_index: number
}

export interface Question {
  id: string
  question_text: string
  correct_answer: string | null
  order_index: number
  choices: Choice[]
}

export interface QuizSet {
  id: string
  title: string
  description: string | null
  mode: 'quiz' | 'qa'
  created_by: string | null
  created_by_username: string | null
  created_at: string
  questions: Question[]
}

export interface AuthUser {
  user_id: string
  username: string
  access_token: string
}
