import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import type { QuizSet } from '../types'

export default function JoinSet() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [set, setSet] = useState<QuizSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [participantName, setParticipantName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    client.get(`/api/sets/${id}`)
      .then((res) => setSet(res.data))
      .catch(() => setSet(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center text-gray-400 py-20">Đang tải...</div>
  if (!set) return <div className="text-center text-red-500 py-20">Không tìm thấy bộ câu hỏi.</div>

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!participantName.trim()) return
    setError('')
    setJoining(true)
    try {
      const res = await client.post(`/api/sets/${id}/join`, {
        participant_name: participantName.trim(),
        password: password,
      })
      navigate(`/sets/${id}/play`, {
        state: { set: res.data, participantName: participantName.trim() },
      })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Không thể tham gia')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{set.title}</h1>
        <p className="text-sm text-gray-400 mb-6">
          {set.questions.length} câu hỏi ·{' '}
          <span className={`font-medium ${set.mode === 'quiz' ? 'text-blue-500' : 'text-purple-500'}`}>
            {set.mode === 'quiz' ? 'Trắc nghiệm' : 'Tự luận'}
          </span>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên của bạn *</label>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              required
              maxLength={50}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ví dụ: Nguyễn Văn A"
              autoFocus
            />
          </div>

          {set.has_password && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Nhập mật khẩu để tham gia"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={joining}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 mt-2"
          >
            {joining ? 'Đang vào...' : 'Bắt đầu ôn tập'}
          </button>
        </form>
      </div>
    </div>
  )
}
