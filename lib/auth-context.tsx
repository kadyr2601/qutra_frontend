"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { mockUser } from "./mock-data"

type User = typeof mockUser | null

interface AuthContextType {
  user: User
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Mock login - accepts any email/password combo
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
    
    if (email && password) {
      setUser({
        ...mockUser,
        email,
        name: email.split("@")[0],
      })
      return true
    }
    return false
  }, [])

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock register
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    if (email && password && name) {
      setUser({
        ...mockUser,
        email,
        name,
      })
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
