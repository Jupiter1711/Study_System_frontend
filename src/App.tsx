import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/ui/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateSet from './pages/CreateSet'
import SetDetail from './pages/SetDetail'
import PlaySet from './pages/PlaySet'
import EditSet from './pages/EditSet'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/sets/create" element={<CreateSet />} />
              <Route path="/sets/:id" element={<SetDetail />} />
              <Route path="/sets/:id/play" element={<PlaySet />} />
              <Route path="/sets/:id/edit" element={<EditSet />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
