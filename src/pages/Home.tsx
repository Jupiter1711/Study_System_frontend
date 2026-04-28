import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import type { QuizSet } from '../types'

export default function Home() {
  const [sets, setSets] = useState<QuizSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/api/sets')
      .then((res) => setSets(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center text-gray-400 py-20">Đang tải...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tất cả bộ câu hỏi</h1>
        <Link
          to="/sets/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Tạo bộ câu hỏi
        </Link>
      </div>

      {sets.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-lg">Chưa có bộ câu hỏi nào.</p>
          <p className="text-sm mt-1">Hãy tạo bộ câu hỏi đầu tiên!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((s) => (
            <Link key={s.id} to={`/sets/${s.id}`} className="block">
              <div className="bg-white rounded-xl shadow hover:shadow-md transition p-5 h-full border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold text-gray-800 text-base leading-tight">{s.title}</h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                    s.mode === 'quiz' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {s.mode === 'quiz' ? 'QUIZ' : 'Q&A'}
                  </span>
                </div>
                {s.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{s.description}</p>}
                <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
                  <span>{s.questions.length} câu hỏi</span>
                  <span>bởi {s.created_by_username || 'Ẩn danh'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
