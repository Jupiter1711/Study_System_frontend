import { useState, useRef } from 'react'
import type { Question } from '../../types'

interface Props {
  questions: Question[]
  onFinish: (score: number, total: number) => void
}

export default function QuizPlayer({ questions, onFinish }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const scoreRef = useRef(0)

  const q = questions[current]
  const isLast = current + 1 >= questions.length

  const handleSelect = (choiceId: string, isCorrect: boolean) => {
    if (answered) return
    setSelected(choiceId)
    setAnswered(true)
    if (isCorrect) scoreRef.current += 1
  }

  const handleNext = () => {
    if (isLast) {
      onFinish(scoreRef.current, questions.length)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const getButtonClass = (choiceId: string, isCorrect: boolean) => {
    if (!answered) return 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
    if (isCorrect) return 'border-green-500 bg-green-50 text-green-800 font-medium'
    if (choiceId === selected) return 'border-red-500 bg-red-50 text-red-700'
    return 'border-gray-200 bg-gray-50 text-gray-400'
  }

  const selectedCorrect = selected ? q.choices.find((c) => c.id === selected)?.is_correct : false

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Câu {current + 1} / {questions.length}</span>
        <span>Đúng: {scoreRef.current}</span>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-lg font-semibold text-gray-800 mb-6">{q.question_text}</p>

        <div className={`grid gap-3 ${q.choices.length <= 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {q.choices.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id, c.is_correct)}
              disabled={answered}
              className={`border-2 rounded-xl px-4 py-3 text-left text-sm transition ${getButtonClass(c.id, c.is_correct)}`}
            >
              {c.choice_text}
            </button>
          ))}
        </div>

        {answered && (
          <div className="mt-4">
            {selectedCorrect ? (
              <p className="text-green-600 font-medium">Chính xác!</p>
            ) : (
              <p className="text-red-600 font-medium">
                Sai rồi! Đáp án đúng:{' '}
                <span className="font-bold">{q.choices.find((c) => c.is_correct)?.choice_text}</span>
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
