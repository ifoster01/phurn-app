import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function AuthPromptModal({ visible, onDismiss }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignUp = () => {
    onDismiss();
    navigation.navigate('Tabs', { screen: 'Profile' });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background }
        ]}
      >
        <Text variant="headlineMedium" style={styles.title}>
          Oops! In order to save to a Wish List,
          you need to have an account.
        </Text>

        <Button
          mode="contained"
          onPress={handleSignUp}
          style={styles.signUpButton}
          contentStyle={styles.signUpButtonContent}
          labelStyle={styles.signUpButtonLabel}
        >
          Sign Up!
        </Button>

        <Button
          mode="outlined"
          onPress={handleSignUp}
          style={styles.accountButton}
          contentStyle={styles.accountButtonContent}
          labelStyle={styles.accountButtonLabel}
        >
          I already have an account!
        </Button>

        <Button
          mode="text"
          onPress={onDismiss}
          style={styles.noThanksButton}
          contentStyle={styles.noThanksButtonContent}
          labelStyle={styles.noThanksButtonLabel}
        >
          I'll keep furniture shopping the hard way
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: '30%',
    marginBottom: 'auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#E84D1C',
    lineHeight: 38,
  },
  signUpButton: {
    width: '100%',
    borderRadius: 100,
    marginBottom: 24,
    backgroundColor: '#E84D1C',
  },
  signUpButtonContent: {
    paddingVertical: 8,
  },
  signUpButtonLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  noThanksButton: {
    marginBottom: 8,
    width: '100%',
  },
  noThanksButtonContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  noThanksButtonLabel: {
    fontSize: 14,
    color: '#666666',
  },
  accountButton: {
    width: '100%',
    borderRadius: 100,
    marginBottom: 24,
  },
  accountButtonContent: {
    paddingVertical: 8,
  },
  accountButtonLabel: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
}); 