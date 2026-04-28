import { useState } from 'react'

export interface ChoiceForm {
  choice_text: string
  is_correct: boolean
}

export interface QuestionForm {
  question_text: string
  correct_answer: string
  choices: ChoiceForm[]
}

export interface QuizSetForm {
  title: string
  description: string
  mode: 'quiz' | 'qa'
  questions: QuestionForm[]
}

const emptyChoice = (): ChoiceForm => ({ choice_text: '', is_correct: false })
const emptyQuestion = (mode: 'quiz' | 'qa'): QuestionForm => ({
  question_text: '',
  correct_answer: '',
  choices: mode === 'quiz' ? [emptyChoice(), emptyChoice()] : [],
})

interface Props {
  initial?: QuizSetForm
  onSubmit: (form: QuizSetForm) => void
  loading: boolean
  submitLabel: string
}

export default function QuizCreator({ initial, onSubmit, loading, submitLabel }: Props) {
  const [form, setForm] = useState<QuizSetForm>(initial ?? {
    title: '',
    description: '',
    mode: 'quiz',
    questions: [emptyQuestion('quiz')],
  })

  const setMode = (mode: 'quiz' | 'qa') => {
    setForm((f) => ({
      ...f,
      mode,
      questions: f.questions.map((q) => ({
        ...q,
        choices: mode === 'quiz' ? [emptyChoice(), emptyChoice()] : [],
        correct_answer: '',
      })),
    }))
  }

  const setQuestion = (qi: number, field: keyof QuestionForm, value: string) => {
    setForm((f) => {
      const qs = [...f.questions]
      qs[qi] = { ...qs[qi], [field]: value }
      return { ...f, questions: qs }
    })
  }

  const addQuestion = () => {
    setForm((f) => ({ ...f, questions: [...f.questions, emptyQuestion(f.mode)] }))
  }

  const removeQuestion = (qi: number) => {
    setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }))
  }

  const setChoice = (qi: number, ci: number, field: keyof ChoiceForm, value: string | boolean) => {
    setForm((f) => {
      const qs = [...f.questions]
      const choices = [...qs[qi].choices]
      choices[ci] = { ...choices[ci], [field]: value }
      qs[qi] = { ...qs[qi], choices }
      return { ...f, questions: qs }
    })
  }

  const setCorrectChoice = (qi: number, ci: number) => {
    setForm((f) => {
      const qs = [...f.questions]
      const choices = qs[qi].choices.map((c, i) => ({ ...c, is_correct: i === ci }))
      qs[qi] = { ...qs[qi], choices }
      return { ...f, questions: qs }
    })
  }

  const addChoice = (qi: number) => {
    setForm((f) => {
      const qs = [...f.questions]
      if (qs[qi].choices.length >= 8) return f
      qs[qi] = { ...qs[qi], choices: [...qs[qi].choices, emptyChoice()] }
      return { ...f, questions: qs }
    })
  }

  const removeChoice = (qi: number, ci: number) => {
    setForm((f) => {
      const qs = [...f.questions]
      if (qs[qi].choices.length <= 2) return f
      qs[qi] = { ...qs[qi], choices: qs[qi].choices.filter((_, i) => i !== ci) }
      return { ...f, questions: qs }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin bộ câu hỏi */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Thông tin bộ câu hỏi</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên bộ câu hỏi *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Ví dụ: Ôn tập Toán chương 1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            placeholder="Mô tả ngắn về bộ câu hỏi này..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chế độ</label>
          <div className="flex gap-3">
            {(['quiz', 'qa'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  form.mode === m
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                }`}
              >
                {m === 'quiz' ? 'Quiz (trắc nghiệm)' : 'Q&A (tự luận)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Các câu hỏi */}
      {form.questions.map((q, qi) => (
        <div key={qi} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Câu hỏi {qi + 1}</h3>
            {form.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qi)}
                className="text-red-500 text-sm hover:underline"
              >
                Xoá câu hỏi
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung câu hỏi *</label>
            <textarea
              value={q.question_text}
              onChange={(e) => setQuestion(qi, 'question_text', e.target.value)}
              required
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="Nhập câu hỏi..."
            />
          </div>

          {form.mode === 'qa' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đáp án đúng *</label>
              <input
                type="text"
                value={q.correct_answer}
                onChange={(e) => setQuestion(qi, 'correct_answer', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Nhập đáp án đúng..."
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Các đáp án ({q.choices.length}/8) — chọn đáp án đúng bằng radio
              </label>
              {q.choices.map((c, ci) => (
                <div key={ci} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={c.is_correct}
                    onChange={() => setCorrectChoice(qi, ci)}
                    className="accent-green-500 w-4 h-4 shrink-0"
                  />
                  <input
                    type="text"
                    value={c.choice_text}
                    onChange={(e) => setChoice(qi, ci, 'choice_text', e.target.value)}
                    required
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder={`Đáp án ${ci + 1}`}
                  />
                  {q.choices.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeChoice(qi, ci)}
                      className="text-red-400 hover:text-red-600 text-lg leading-none px-1"
                      title="Xoá đáp án"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {q.choices.length < 8 && (
                <button
                  type="button"
                  onClick={() => addChoice(qi)}
                  className="text-indigo-600 text-sm hover:underline mt-1"
                >
                  + Thêm đáp án
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={addQuestion}
          className="border border-indigo-400 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50"
        >
          + Thêm câu hỏi
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 ml-auto"
        >
          {loading ? 'Đang lưu...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
