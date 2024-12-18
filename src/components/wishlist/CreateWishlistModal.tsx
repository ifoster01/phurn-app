import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, useTheme } from 'react-native-paper';
import { useCreateWishlist } from '@/hooks/api/useWishlists';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onCreateSuccess: (name: string) => void;
}

export function CreateWishlistModal({ visible, onDismiss, onCreateSuccess }: Props) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const createWishlist = useCreateWishlist();

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await createWishlist.mutateAsync({ name: name.trim() });
      onCreateSuccess(name.trim());
      setName('');
    } catch (error) {
      console.error('Error creating wishlist:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
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
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          autoFocus
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleCreate}
            loading={createWishlist.isPending}
            disabled={!name.trim()}
            style={styles.button}
          >
            Create
          </Button>
          <Button
            mode="text"
            onPress={onDismiss}
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
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    marginVertical: 4,
  },
}); 