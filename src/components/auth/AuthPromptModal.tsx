import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

interface AuthPromptModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export function AuthPromptModal({ visible, onDismiss }: AuthPromptModalProps) {
  const navigation = useNavigation();

  const handleSignIn = () => {
    onDismiss();
    navigation.navigate('Profile' as never);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Animated.View 
          entering={FadeIn.duration(300).springify()}
          style={styles.content}
        >
          <Text variant="headlineSmall" style={styles.title}>
            Sign In Required
          </Text>
          <Text style={styles.description}>
            Sign in to save items to your wishlist and access them from any device
          </Text>
          <View style={styles.buttons}>
            <Animated.View 
              entering={FadeIn.delay(100).duration(200)}
              style={styles.buttonContainer}
            >
              <Button
                mode="contained"
                onPress={handleSignIn}
                style={styles.signInButton}
              >
                Sign In
              </Button>
            </Animated.View>
            <Animated.View 
              entering={FadeIn.delay(150).duration(200)}
              style={styles.buttonContainer}
            >
              <Button
                mode="text"
                onPress={onDismiss}
                style={styles.noThanksButton}
              >
                No thanks, I'll continue browsing
              </Button>
            </Animated.View>
          </View>
        </Animated.View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666666',
  },
  buttons: {
    width: '100%',
    gap: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  signInButton: {
    width: '100%',
  },
  noThanksButton: {
    width: '100%',
  },
}); 