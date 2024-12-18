import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { env } from '../config/env'

// Maximum size for SecureStore (2048 bytes)
const MAX_SECURE_STORE_SIZE = 2000

const HybridStorageAdapter = {
  getItem: async (key: string) => {
    try {
      // First try SecureStore
      const secureValue = await SecureStore.getItemAsync(key)
      if (secureValue) return secureValue

      // If not in SecureStore, try AsyncStorage
      return await AsyncStorage.getItem(key)
    } catch (error) {
      console.error('Error reading from storage:', error)
      return null
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      // If value is small enough, use SecureStore
      if (value.length <= MAX_SECURE_STORE_SIZE) {
        await SecureStore.setItemAsync(key, value)
      } else {
        // For larger values, use AsyncStorage
        await AsyncStorage.setItem(key, value)
      }
    } catch (error) {
      console.error('Error writing to storage:', error)
    }
  },
  removeItem: async (key: string) => {
    try {
      // Remove from both storages to ensure it's completely removed
      await Promise.all([
        SecureStore.deleteItemAsync(key),
        AsyncStorage.removeItem(key)
      ])
    } catch (error) {
      console.error('Error removing from storage:', error)
    }
  },
}

export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      storage: HybridStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
) 