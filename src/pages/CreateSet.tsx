import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import QuizCreator, { type QuizSetForm } from '../components/quiz/QuizCreator'

export default function CreateSet() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        Vui lòng <a href="/login" className="text-indigo-600 underline">đăng nhập</a> để tạo bộ câu hỏi.
      </div>
    )
  }

  const handleSubmit = async (form: QuizSetForm) => {
    setError('')
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        mode: form.mode,
        access_password: form.access_password || null,
        questions: form.questions.map((q, qi) => ({
          question_text: q.question_text,
          correct_answer: form.mode === 'qa' ? q.correct_answer : null,
          order_index: qi,
          choices: form.mode === 'quiz'
            ? q.choices.map((c, ci) => ({ choice_text: c.choice_text, is_correct: c.is_correct, order_index: ci }))
            : [],
        })),
      }
      const res = await client.post('/api/sets', payload)
      navigate(`/sets/${res.data.id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Không thể tạo bộ câu hỏi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tạo bộ câu hỏi mới</h1>
      {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
      <QuizCreator onSubmit={handleSubmit} loading={loading} submitLabel="Tạo bộ câu hỏi" />
    </div>
  )
}
