import { useAuth } from '@/providers/AuthProvider'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { useTheme } from 'react-native-paper'

export const AppleButton = () => {
    const theme = useTheme()
    const { user, signOut, signInWithGoogle, signInWithApple, signIn, signUp } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleApplePress = async () => {
        try {
            setError(null)
            setLoading(true)
            await signInWithApple()
        } catch (err) {
            console.error('Apple sign in error:', err)
        } finally {
            setLoading(false)
        }
    }
  
    return (
        <Button
            mode="outlined"
            onPress={handleApplePress}
            icon="apple"
            style={styles.button}
            contentStyle={styles.content}
            textColor={theme.dark ? 'white' : 'black'}
        >
            Continue with Apple
        </Button>
    )
}

const styles = StyleSheet.create({
  button: {
    borderColor: '#000000',
    borderWidth: 1,
  },
  content: {
    paddingVertical: 8,
  },
}) 