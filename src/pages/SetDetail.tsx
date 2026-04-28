import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { QuizSet } from '../types'

export default function SetDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [set, setSet] = useState<QuizSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    client.get(`/api/sets/${id}`)
      .then((res) => setSet(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xoá bộ câu hỏi này?')) return
    setDeleting(true)
    try {
      await client.delete(`/api/sets/${id}`)
      navigate('/')
    } catch {
      alert('Không thể xoá bộ câu hỏi')
      setDeleting(false)
    }
  }

  if (loading) return <div className="text-center text-gray-400 py-20">Đang tải...</div>
  if (!set) return <div className="text-center text-red-500 py-20">Không tìm thấy bộ câu hỏi.</div>

  const isOwner = user?.user_id === set.created_by

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">← Tất cả bộ câu hỏi</Link>

      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{set.title}</h1>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ml-3 shrink-0 ${
            set.mode === 'quiz' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
          }`}>
            {set.mode === 'quiz' ? 'QUIZ' : 'Q&A'}
          </span>
        </div>

        {set.description && <p className="text-gray-500 text-sm mb-3">{set.description}</p>}

        <p className="text-sm text-gray-400 mb-6">
          {set.questions.length} câu hỏi · bởi <strong>{set.created_by_username || 'Ẩn danh'}</strong>
        </p>

        <div className="flex items-center gap-3">
          <Link
            to={`/sets/${id}/play`}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Bắt đầu ôn tập
          </Link>
          {isOwner && (
            <>
              <Link
                to={`/sets/${id}/edit`}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Chỉnh sửa
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="border border-red-300 text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? 'Đang xoá...' : 'Xoá'}
              </button>
            </>
          )}
        </div>
      </div>

      {set.questions.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="font-semibold text-gray-700">Danh sách câu hỏi</h2>
          {set.questions.map((q, i) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="font-medium text-gray-800 mb-2">{i + 1}. {q.question_text}</p>
              {set.mode === 'quiz' ? (
                <div className="grid grid-cols-2 gap-2">
                  {q.choices.map((c) => (
                    <div
                      key={c.id}
                      className={`text-sm px-3 py-1.5 rounded-lg border ${
                        c.is_correct
                          ? 'border-green-400 bg-green-50 text-green-700 font-medium'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {c.choice_text}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-300 inline-block">
                  Đáp án: {q.correct_answer}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
