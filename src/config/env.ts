import {
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
} from '@env'

// Validate environment variables at runtime
const requiredEnvVars = {
  SUPABASE_URL: EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: EXPO_PUBLIC_SUPABASE_ANON_KEY,
  GOOGLE_WEB_CLIENT_ID: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  GOOGLE_IOS_URL_SCHEME: EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
} as const

// Ensure all required env vars are defined
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

export const env = {
  supabase: {
    url: EXPO_PUBLIC_SUPABASE_URL,
    anonKey: EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  google: {
    webClientId: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    iosUrlScheme: EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
  },
} as const 