import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, useTheme, HelperText } from 'react-native-paper';
import { useCreateWishlist } from '@/hooks/api/useWishlists';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onCreateSuccess: () => void;
}

export function CreateWishlistModal({ visible, onDismiss, onCreateSuccess }: Props) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createWishlist = useCreateWishlist();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setError(null);

    try {
      await createWishlist.mutateAsync({ name: name.trim() });
      setName('');
      onCreateSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleDismiss = () => {
    setName('');
    setError(null);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background }
        ]}
      >
        <Text variant="titleLarge" style={styles.title}>
          Create New Wishlist
        </Text>

        <TextInput
          label="Wishlist Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          mode="outlined"
          style={styles.input}
          autoFocus
          error={!!error}
        />
        
        {error && (
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleCreate}
            loading={createWishlist.isPending}
            disabled={!name.trim() || createWishlist.isPending}
            style={styles.button}
          >
            Create
          </Button>
          <Button
            mode="text"
            onPress={handleDismiss}
            disabled={createWishlist.isPending}
            style={styles.button}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 8,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 16,
  },
  button: {
    marginVertical: 4,
  },
}); 