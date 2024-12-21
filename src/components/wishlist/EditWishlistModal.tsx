import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Modal, TextInput, Button, Text } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
interface Props {
  visible: boolean;
  onDismiss: () => void;
  wishlistId: string;
  currentName: string;
}
export function EditWishlistModal({ visible, onDismiss, wishlistId, currentName }: Props) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const updateWishlist = useMutation({
    mutationFn: async (newName: string) => {
      const { error } = await supabase
        .from('wishlists')
        .update({ name: newName })
        .eq('id', wishlistId);
      if (error) throw error;
      return newName;
    },
    onSuccess: (newName) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      onDismiss();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });
  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name cannot be empty');
      return;
    }
    if (trimmedName === currentName) {
      onDismiss();
      return;
    }
    setError(null);
    updateWishlist.mutate(trimmedName);
  };
  const handleDismiss = () => {
    setError(null);
    setName(currentName);
    onDismiss();
  };
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.container}
      >
        <Text variant="titleLarge" style={styles.title}>Edit Wishlist Name</Text>
        
        {error && (
          <Text style={styles.error}>{error}</Text>
        )}
        <TextInput
          value={name}
          onChangeText={setName}
          mode="outlined"
          label="Wishlist Name"
          style={styles.input}
          autoFocus
          error={!!error}
          disabled={updateWishlist.isPending}
        />
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          loading={updateWishlist.isPending}
          disabled={updateWishlist.isPending || !name.trim() || name.trim() === currentName}
        >
          Save
        </Button>
        <Button
          mode="outlined"
          onPress={handleDismiss}
          style={styles.cancelButton}
          disabled={updateWishlist.isPending}
        >
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  error: {
    color: '#B00020',
    marginBottom: 16,
    textAlign: 'center',
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 0,
  },
}); 