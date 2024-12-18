import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { lightTheme } from '../../theme'
import { env } from '@/config/env'
import * as Google from 'expo-auth-session/providers/google'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/providers/AuthProvider'

export const GoogleButton = () => {
    const theme = useTheme()
    const { user, signOut, signInWithGoogle, signInWithApple, signIn, signUp } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGooglePress = async () => {
        try {
          setError(null)
          setLoading(true)
          await signInWithGoogle()
        } catch (err) {
          console.error('Google sign in error:', err)
        } finally {
          setLoading(false)
        }
    }

    return (
        <Button
        mode="outlined"
        onPress={handleGooglePress}
        icon="google"
        style={styles.button}
        contentStyle={styles.content}
        >
            Continue with Google
        </Button>
    )
}

const styles = StyleSheet.create({
  button: {
    borderColor: lightTheme.colors.primary,
    borderWidth: 1,
  },
  content: {
    paddingVertical: 8,
  },
}) 