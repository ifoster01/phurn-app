import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthContextType, AuthState, User } from '../types/auth'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform, Linking } from 'react-native'
import Constants from 'expo-constants'
import { env } from '../config/env'

// Initialize WebBrowser for Google Auth
WebBrowser.maybeCompleteAuthSession()

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  initialized: false,
}

const mapSupabaseUser = (user: SupabaseUser | null): User | null => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email!,
    phoneNumber: user.phone || '',
    createdAt: user.created_at!,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState)
  const mountedRef = React.useRef(true)
  const pendingAuthRef = React.useRef<Promise<void> | null>(null)

  const safeSetState = (newState: Partial<AuthState>) => {
    if (mountedRef.current) {
      setState(prev => ({ ...prev, ...newState }))
    }
  }

  // Configure Google Sign In
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    iosClientId: env.google.iosClientId,
    webClientId: env.google.webClientId,
  })

  useEffect(() => {
    // Handle initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        safeSetState({
          session,
          user: mapSupabaseUser(session?.user ?? null),
          initialized: true,
          loading: false,
        })
      } catch (error) {
        console.error('Error initializing auth:', error)
        safeSetState({
          initialized: true,
          loading: false,
        })
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        safeSetState({
          session,
          user: mapSupabaseUser(session?.user ?? null),
          loading: false,
        })
      }
    )

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  // Handle Google Sign In response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params
      handleGoogleToken(id_token)
    }
  }, [googleResponse])

  const handleGoogleToken = async (token: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token,
      })
      if (error) throw error
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signIn = async (email: string, password: string) => {
    const authPromise = (async () => {
      safeSetState({ loading: true })
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } finally {
        safeSetState({ loading: false })
      }
    })()
    
    pendingAuthRef.current = authPromise
    await authPromise
    if (pendingAuthRef.current === authPromise) {
      pendingAuthRef.current = null
    }
  }

  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      const result = await googlePromptAsync()
      if (result.type !== 'success') {
        throw new Error('Google sign in was cancelled or failed')
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      console.warn('Apple Sign In is only available on iOS devices')
      return
    }

    try {
      setState(prev => ({ ...prev, loading: true }))
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      })

      if (error) throw error
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        switch (error.code) {
          case 'ERR_REQUEST_CANCELED':
            // User cancelled the sign-in flow
            return
          case 'ERR_INVALID_RESPONSE':
            throw new Error('Invalid response from Apple Sign In')
          default:
            console.error('Apple sign in error:', error)
            throw error
        }
      }
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const getRedirectUrl = () => {
    // In development
    if (__DEV__) {
      if (Platform.OS === 'ios') {
        return 'http://localhost:3000/reset-password'  // Your app's URL scheme
      }
      // For Android in dev
      return 'http://localhost:3000/reset-password'
    }
    
    // In production
    if (Platform.OS === 'ios') {
      return 'https://pickpockt.com/reset-password'
    }
    if (Platform.OS === 'android') {
      return 'https://pickpockt.com/reset-password'
    }
    // Fallback to web URL if needed
    return `${env.supabase.url}/auth/v1/verify`
  }

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const redirectTo = getRedirectUrl()
      console.log('Reset password redirect URL:', redirectTo) // For debugging

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })
      
      if (error) {
        console.log('Detailed reset password error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error
        })
        throw error
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
  }

  React.useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 