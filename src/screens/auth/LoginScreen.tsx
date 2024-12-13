import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Checkbox } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuthStore } from '@/store/auth';
import { NavigationProps } from '@/navigation/types';

type Props = NavigationProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ email, password, rememberMe });
      navigation.replace('Tabs');
    } catch (error) {
      // Handle error
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>PHURN</Text>
          <Text style={styles.subtitle}>Log in to access your wishlists!</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.button}
          >
            Log In
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            Forgot Password?
          </Button>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E85D3F',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    marginTop: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#E85D3F',
  },
  forgotPassword: {
    marginTop: 16,
  },
});