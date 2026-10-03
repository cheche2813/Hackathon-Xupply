import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { DEMO_PASSWORD, demoUsers, type DemoUser } from '@/data/users'
import { readItem, removeItem, STORAGE_KEYS, writeItem } from '@/lib/storage'

export type SignInResult = { ok: true } | { ok: false; error: string }

interface AuthContextType {
  user: DemoUser | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => SignInResult
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const findUserByEmail = (email: string) => {
  const term = email.trim().toLowerCase()
  return demoUsers.find((user) => user.email.toLowerCase() === term)
}

const readSession = (): DemoUser | null => {
  const stored = readItem(STORAGE_KEYS.session)
  if (!stored) return null
  return demoUsers.find((user) => user.id === stored) ?? null
}

const writeSession = (user: DemoUser | null) => {
  if (user) {
    writeItem(STORAGE_KEYS.session, user.id)
  } else {
    removeItem(STORAGE_KEYS.session)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(readSession)

  useEffect(() => {
    writeSession(user)
  }, [user])

  const signIn = useCallback((email: string, password: string): SignInResult => {
    if (email.trim().length === 0) {
      return { ok: false, error: 'Escribe el correo de tu usuario demo.' }
    }

    const match = findUserByEmail(email)
    if (!match) {
      return { ok: false, error: 'Ese correo no es parte de los usuarios demo de Xupply.' }
    }

    if (password !== DEMO_PASSWORD) {
      return { ok: false, error: `La contraseña compartida de la demo es ${DEMO_PASSWORD}.` }
    }

    setUser(match)
    return { ok: true }
  }, [])

  const signOut = useCallback(() => setUser(null), [])

  const value = useMemo<AuthContextType>(
    () => ({ user, isAuthenticated: user !== null, signIn, signOut }),
    [signIn, signOut, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
