import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';

export const useAuth = () => {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        await logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [logout]);

  const requireAuth = (action: () => void, message = 'Please sign in to continue') => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Profile' as never),
          },
        ]
      );
      return false;
    }
    action();
    return true;
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    requireAuth,
  };
}; 