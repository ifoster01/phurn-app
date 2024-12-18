import { Session } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  phoneNumber?: string
  fullName?: string
  createdAt: string
}

export type AuthState = {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

export type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
} 