import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { QuizSet, SessionResult } from '../types'

export default function SetDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [set, setSet] = useState<QuizSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [results, setResults] = useState<SessionResult[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    client.get(`/api/sets/${id}`)
      .then((res) => setSet(res.data))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!set || !user || user.user_id !== set.created_by) return
    client.get(`/api/sets/${id}/results`)
      .then((res) => setResults(res.data))
      .catch(() => {})
  }, [id, set, user])

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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

        <p className="text-sm text-gray-400 mb-4">
          {set.questions.length} câu hỏi · bởi <strong>{set.created_by_username || 'Ẩn danh'}</strong>
          {set.has_password && (
            <span className="ml-2 text-yellow-600 font-medium">· Có mật khẩu</span>
          )}
        </p>

        {/* Shareable link */}
        <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xs text-gray-500 truncate flex-1">{window.location.href}</span>
          <button
            onClick={handleCopyLink}
            className="text-xs font-medium px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 shrink-0"
          >
            {copied ? 'Đã sao chép!' : 'Sao chép link'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/sets/${id}/join`}
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

      {/* Results table for owner */}
      {isOwner && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-700 mb-3">Kết quả người tham gia ({results.length})</h2>
          {results.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400 text-sm border border-gray-100">
              Chưa có ai hoàn thành bộ câu hỏi này.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Tên</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">Điểm</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">%</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((r) => {
                    const pct = Math.round((r.score / r.total) * 100)
                    return (
                      <tr key={r.id}>
                        <td className="px-4 py-3 text-gray-800 font-medium">{r.participant_name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{r.score}/{r.total}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {pct}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-400">
                          {new Date(r.completed_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
