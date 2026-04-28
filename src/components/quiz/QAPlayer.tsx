import { useState, useRef, FormEvent } from 'react'
import type { Question } from '../../types'

interface Props {
  questions: Question[]
  onFinish: (score: number, total: number) => void
}

export default function QAPlayer({ questions, onFinish }: Props) {
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const scoreRef = useRef(0)

  const q = questions[current]
  const isLast = current + 1 >= questions.length

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (answered) return
    const isCorrect = input.trim().toLowerCase() === (q.correct_answer ?? '').trim().toLowerCase()
    setCorrect(isCorrect)
    setAnswered(true)
    if (isCorrect) scoreRef.current += 1
  }

  const handleNext = () => {
    if (isLast) {
      onFinish(scoreRef.current, questions.length)
    } else {
      setCurrent((c) => c + 1)
      setInput('')
      setAnswered(false)
      setCorrect(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Câu {current + 1} / {questions.length}</span>
        <span>Đúng: {scoreRef.current}</span>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-lg font-semibold text-gray-800 mb-6">{q.question_text}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={answered}
            className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
              answered
                ? correct
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 bg-white'
            }`}
            placeholder="Nhập câu trả lời của bạn..."
          />
          {!answered && (
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Kiểm tra
            </button>
          )}
        </form>

        {answered && (
          <div className="mt-4">
            {correct ? (
              <p className="text-green-600 font-medium">Chính xác!</p>
            ) : (
              <p className="text-red-600 font-medium">
                Sai rồi! Đáp án đúng:{' '}
                <span className="font-bold">{q.correct_answer}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {answered && (
        <div className="text-right">
          <button
            onClick={handleNext}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            {isLast ? 'Xem kết quả' : 'Câu tiếp theo'}
          </button>
        </div>
      )}
    </div>
  )
}
