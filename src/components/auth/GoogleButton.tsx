import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { lightTheme } from '../../theme'
import { env } from '@/config/env'
import * as Google from 'expo-auth-session/providers/google'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/providers/AuthProvider'

export const GoogleButton = () => {
    const { signInWithGoogle } = useAuth()
    const [error, setError] = useState<string | null>(null)

    const handleGooglePress = async () => {
        try {
          setError(null)
          await signInWithGoogle()
        } catch (err) {
          console.error('Google sign in error:', err)
        }
    }

    return (
        <Button
        mode="outlined"
        onPress={handleGooglePress}
        icon="google"
        style={styles.button}
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
}) 