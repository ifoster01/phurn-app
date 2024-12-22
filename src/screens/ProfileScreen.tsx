import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { Appbar, Button, List, Text, TextInput, Divider } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '@/navigation/types';
import { AuthError } from '@supabase/supabase-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AppleButton } from '@/components/auth/AppleButton';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function ProfileScreen() {
  const { user, signIn, signOut, deleteAccount } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert('Error', authError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      try {
        const isSignedIn = await GoogleSignin.getCurrentUser();
        if (isSignedIn) {
          await GoogleSignin.signOut();
        }
      } catch (error) {
        // Ignore Google Sign-In errors during logout
      }
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert('Error', authError.message);
    }
  };

  if (!user) {
    return (
      <SafeAreaWrapper>
        <Appbar.Header style={{ marginTop: -44 }}>
          <Appbar.Content title="Account" />
        </Appbar.Header>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.title}>
            Sign In to Your Account
          </Text>
          <Text style={styles.subtitle}>
            Create an account or sign in to save your favorite items and create wishlists
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
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            autoComplete="password"
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleEmailLogin}
            loading={loading}
            style={styles.button}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => {}}
            style={styles.forgotPassword}
          >
            Forgot Password?
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Signup' as never)}
            style={styles.signupLink}
          >
            Don't have an account? Sign Up
          </Button>
        </ScrollView>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <Appbar.Header style={{ marginTop: -44 }}>
        <Appbar.Content title="Account" />
      </Appbar.Header>

      <ScrollView style={styles.container}>
        <List.Section>
          <List.Item
            title="Email"
            description={user?.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Password"
            description="••••••••••"
            left={(props) => <List.Icon {...props} icon="lock" />}
            // right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.signOutButton}
          >
            Sign Out
          </Button>

          <Button
            mode="outlined"
            onPress={deleteAccount}
            style={styles.deleteButton}
            textColor="#FF3B30"
          >
            Delete Account
          </Button>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  socialButtons: {
    gap: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  socialButton: {
    marginVertical: 8,
  },
  divider: {
    marginVertical: 24,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 24,
  },
  signOutButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#FF3B30',
  },
  forgotPassword: {
    marginTop: 8,
  },
  signupLink: {
    marginTop: 8,
  },
});