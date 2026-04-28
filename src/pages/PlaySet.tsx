import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import type { QuizSet } from '../types'
import QuizPlayer from '../components/quiz/QuizPlayer'
import QAPlayer from '../components/quiz/QAPlayer'

export default function PlaySet() {
  const { id } = useParams<{ id: string }>()
  const [set, setSet] = useState<QuizSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)

  useEffect(() => {
    client.get(`/api/sets/${id}`)
      .then((res) => setSet(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center text-gray-400 py-20">Đang tải...</div>
  if (!set) return <div className="text-center text-red-500 py-20">Không tìm thấy bộ câu hỏi.</div>
  if (set.questions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Bộ câu hỏi này chưa có câu hỏi nào.
        <div className="mt-4"><Link to={`/sets/${id}`} className="text-indigo-600 underline">Quay lại</Link></div>
      </div>
    )
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100)
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? 'text-green-500' : pct >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
            {pct}%
          </div>
          <p className="text-xl text-gray-700 mb-1">
            {result.score} / {result.total} câu đúng
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {pct === 100 ? 'Xuất sắc! Bạn trả lời đúng tất cả!' : pct >= 70 ? 'Tốt lắm!' : 'Cố gắng hơn nhé!'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setResult(null)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Làm lại
            </button>
            <Link
              to={`/sets/${id}`}
              className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/sets/${id}`} className="text-gray-400 hover:text-gray-600">← Quay lại</Link>
        <h1 className="text-xl font-bold text-gray-800">{set.title}</h1>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          set.mode === 'quiz' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
        }`}>
          {set.mode === 'quiz' ? 'QUIZ' : 'Q&A'}
        </span>
      </div>

      {set.mode === 'quiz' ? (
        <QuizPlayer questions={set.questions} onFinish={(score, total) => setResult({ score, total })} />
      ) : (
        <QAPlayer questions={set.questions} onFinish={(score, total) => setResult({ score, total })} />
      )}
    </div>
  )
}
