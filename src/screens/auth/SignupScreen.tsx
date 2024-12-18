import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Button, TextInput, Text, Divider, useTheme } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/providers/AuthProvider';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { AuthError } from '@supabase/supabase-js';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AppleButton } from '@/components/auth/AppleButton';

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
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Account
        </Text>

        <View style={styles.socialButtons}>
          <GoogleButton />
          {Platform.OS === 'ios' && (
            <AppleButton />
          )}
        </View>

        <Divider style={styles.divider} />
        <Text style={styles.orText}>or continue with email</Text>

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
          autoCapitalize="words"
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
        />
        <View>
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            autoComplete="password-new"
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {password.length > 0 && (
            <View style={styles.strengthIndicator}>
              <View style={[styles.strengthBar, { backgroundColor: theme.colors.outline }]}>
                <View 
                  style={[
                    styles.strengthProgress, 
                    { 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(),
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                {getPasswordStrengthLabel()}
              </Text>
            </View>
          )}
        </View>
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
          autoComplete="password-new"
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />
        <Button
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          style={styles.button}
        >
          Sign Up
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Already have an account? Login
        </Button>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  socialButtons: {
    gap: 16,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 24,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  strengthIndicator: {
    marginTop: -8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthProgress: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
  },
}); 