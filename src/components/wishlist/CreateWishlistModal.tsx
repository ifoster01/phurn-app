import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, useTheme, HelperText } from 'react-native-paper';
import { useCreateWishlist } from '@/hooks/api/useWishlists';
import { useForm, Controller } from 'react-hook-form';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onCreateSuccess: () => void;
}

interface FormData {
  name: string;
}

export function CreateWishlistModal({ visible, onDismiss, onCreateSuccess }: Props) {
  const theme = useTheme();
  const createWishlist = useCreateWishlist();
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      name: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createWishlist.mutateAsync({ name: data.name.trim() });
      reset();
      onCreateSuccess();
    } catch (err) {
      // Error will be handled by form state
    }
  };

  const handleDismiss = () => {
    reset();
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

        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Name is required',
            validate: value => value.trim().length > 0 || 'Name cannot be empty'
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Wishlist Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
              disabled={createWishlist.isPending}
            />
          )}
        />
        
        {errors.name && (
          <HelperText type="error" visible={true}>
            {errors.name.message}
          </HelperText>
        )}

        {createWishlist.error && (
          <HelperText type="error" visible={true}>
            {createWishlist.error instanceof Error ? createWishlist.error.message : 'An unexpected error occurred'}
          </HelperText>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={createWishlist.isPending}
            disabled={createWishlist.isPending}
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
    marginTop: '30%',
    marginBottom: 'auto',
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