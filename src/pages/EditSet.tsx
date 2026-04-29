import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { QuizSet } from '../types'
import QuizCreator, { type QuizSetForm } from '../components/quiz/QuizCreator'

export default function EditSet() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [set, setSet] = useState<QuizSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    client.get(`/api/sets/${id}/detail`).then((res) => {
      setSet(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center text-gray-400 py-20">Đang tải...</div>
  if (!set) return <div className="text-center text-red-500 py-20">Không tìm thấy bộ câu hỏi.</div>

  if (!user || user.user_id !== set.created_by) {
    return <div className="text-center py-20 text-gray-500">Bạn không có quyền chỉnh sửa bộ câu hỏi này.</div>
  }

  const initial: QuizSetForm = {
    title: set.title,
    description: set.description || '',
    mode: set.mode,
    access_password: set.access_password || '',
    questions: set.questions.map((q) => ({
      question_text: q.question_text,
      correct_answer: q.correct_answer || '',
      choices: q.choices.map((c) => ({ choice_text: c.choice_text, is_correct: c.is_correct })),
    })),
  }

  const handleSubmit = async (form: QuizSetForm) => {
    setError('')
    setSaving(true)
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
      await client.put(`/api/sets/${id}`, payload)
      navigate(`/sets/${id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Không thể lưu thay đổi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa bộ câu hỏi</h1>
      {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
      <QuizCreator initial={initial} onSubmit={handleSubmit} loading={saving} submitLabel="Lưu thay đổi" />
    </div>
  )
}
