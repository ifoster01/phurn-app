import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Modal, TextInput, Button, Text } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useForm, Controller } from 'react-hook-form';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  wishlistId: string;
  currentName: string;
}

interface FormData {
  name: string;
}

export function EditWishlistModal({ visible, onDismiss, wishlistId, currentName }: Props) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, formState: { errors, isDirty }, reset } = useForm<FormData>({
    defaultValues: {
      name: currentName
    }
  });

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
      reset({ name: newName });
      onDismiss();
    },
    onError: (error: Error) => {
      // Error will be handled by form state
    },
  });

  const onSubmit = (data: FormData) => {
    const trimmedName = data.name.trim();
    if (trimmedName === currentName) {
      onDismiss();
      return;
    }
    updateWishlist.mutate(trimmedName);
  };

  const handleDismiss = () => {
    reset({ name: currentName });
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
        
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Name is required',
            validate: value => value.trim().length > 0 || 'Name cannot be empty'
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              label="Wishlist Name"
              style={styles.input}
              error={!!errors.name}
              disabled={updateWishlist.isPending}
            />
          )}
        />
        
        {errors.name && (
          <Text style={styles.error}>{errors.name.message}</Text>
        )}
        
        {updateWishlist.error && (
          <Text style={styles.error}>{updateWishlist.error.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
          loading={updateWishlist.isPending}
          disabled={updateWishlist.isPending || !isDirty}
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
    marginTop: '30%',
    marginBottom: 'auto',
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