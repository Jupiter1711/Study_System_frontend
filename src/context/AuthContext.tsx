import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const user_id = localStorage.getItem('user_id')
    const username = localStorage.getItem('username')
    if (token && user_id && username) {
      setUser({ access_token: token, user_id, username })
    }
  }, [])

  const login = (u: AuthUser) => {
    localStorage.setItem('access_token', u.access_token)
    localStorage.setItem('user_id', u.user_id)
    localStorage.setItem('username', u.username)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
