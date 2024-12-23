import { useAuth } from '@/providers/AuthProvider'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { useTheme } from 'react-native-paper'

export const AppleButton = () => {
    const theme = useTheme()
    const { signInWithApple } = useAuth()

    const handleApplePress = async () => {
        try {
            console.log('Signing in with Apple')
            await signInWithApple()
        } catch (err) {
            console.error('Apple sign in error:', err)
        }
    }
  
    return (
        <Button
            mode="outlined"
            onPress={handleApplePress}
            icon="apple"
            style={styles.button}
            textColor={theme.dark ? 'white' : 'black'}
            labelStyle={{ color: '#000000' }}
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
}) 