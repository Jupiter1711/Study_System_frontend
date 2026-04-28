import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-90">
          StudySystem
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:underline text-sm">Trang chủ</Link>
          {user ? (
            <>
              <Link to="/sets/create" className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-50">
                + Tạo bộ câu hỏi
              </Link>
              <span className="text-sm opacity-80">Xin chào, <strong>{user.username}</strong></span>
              <button onClick={handleLogout} className="text-sm hover:underline opacity-80">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:underline">Đăng nhập</Link>
              <Link to="/register" className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-medium hover:bg-indigo-50">
                Đăng kí
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
