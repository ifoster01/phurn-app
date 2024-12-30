import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Button, TextInput, Text, Divider, useTheme, Appbar } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/providers/AuthProvider';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { AuthError } from '@supabase/supabase-js';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AppleButton } from '@/components/auth/AppleButton';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signUp, user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Close screen when user becomes authenticated
  useEffect(() => {
    if (user) {
      navigation.replace('Tabs', { screen: 'Profile' });
    }
  }, [user, navigation]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return '#FF3B30'; // Weak
      case 2:
      case 3:
        return '#FFCC00'; // Medium
      case 4:
      case 5:
        return '#34C759'; // Strong
      default:
        return theme.colors.outline;
    }
  };

  const getPasswordStrengthLabel = () => {
    if (password.length === 0) return '';
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
      case 3:
        return 'Medium';
      case 4:
      case 5:
        return 'Strong';
      default:
        return '';
    }
  };

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      Alert.alert('Error', 'Please choose a stronger password');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, { fullName: fullName.trim() });
      // No need to navigate here as useEffect will handle it
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert('Error', authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <Appbar.Header style={{ marginTop: -44 }}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Create Account" />
      </Appbar.Header>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400).springify()}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Your Account
          </Text>
          <Text style={styles.subtitle}>
            Sign up to save your favorite items and create wishlists
          </Text>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
              autoComplete="name"
              outlineColor="#CCCCCC"
              activeOutlineColor="#EA3A00"
              textColor="#000000"
              theme={{
                colors: {
                  background: '#FFFFFF',
                  placeholder: '#666666',
                  onSurfaceVariant: '#666666',
                }
              }}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              outlineColor="#CCCCCC"
              activeOutlineColor="#EA3A00"
              textColor="#000000"
              theme={{
                colors: {
                  background: '#FFFFFF',
                  placeholder: '#666666',
                  onSurfaceVariant: '#666666',
                }
              }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoComplete="password"
              outlineColor="#CCCCCC"
              activeOutlineColor="#EA3A00"
              textColor="#000000"
              theme={{
                colors: {
                  background: '#FFFFFF',
                  placeholder: '#666666',
                  onSurfaceVariant: '#666666',
                }
              }}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#666666"
                />
              }
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              autoComplete="password"
              outlineColor="#CCCCCC"
              activeOutlineColor="#EA3A00"
              textColor="#000000"
              theme={{
                colors: {
                  background: '#FFFFFF',
                  placeholder: '#666666',
                  onSurfaceVariant: '#666666',
                }
              }}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  color="#666666"
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleSignup}
              loading={loading}
              style={styles.button}
            >
              Create Account
            </Button>
          </Animated.View>

          <Divider style={styles.divider} />
          <Text style={styles.orText}>or continue with email</Text>

          <View style={styles.socialButtons}>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <GoogleButton />
            </Animated.View>
            {Platform.OS === 'ios' && (
              <Animated.View entering={FadeInDown.delay(200).springify()}>
                <AppleButton />
              </Animated.View>
            )}
          </View>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.loginLink}
          >
            Already have an account? Sign In
          </Button>
        </Animated.View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
  loginLink: {
    marginVertical: 8
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  divider: {
    marginVertical: 24,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666666',
  },
}); 