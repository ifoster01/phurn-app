import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, List, useTheme, Divider, Checkbox, Snackbar } from 'react-native-paper';
import { useRemoveFromWishlist, Wishlist } from '@/hooks/api/useWishlists';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  furnitureId: string;
  containingWishlists: (Wishlist & { items: any[] })[];
  onRemoveSuccess: () => void;
}

export function RemoveFromWishlistModal({ 
  visible, 
  onDismiss, 
  furnitureId,
  containingWishlists,
  onRemoveSuccess 
}: Props) {
  const theme = useTheme();
  const [selectedWishlists, setSelectedWishlists] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemove = async () => {
    if (selectedWishlists.size === 0) {
      setError('Please select at least one wishlist');
      return;
    }

    try {
      setError(null);
      const promises = Array.from(selectedWishlists).map(wishlistId =>
        removeFromWishlist.mutateAsync({ wishlistId, furnitureId })
      );

      await Promise.all(promises);
      
      const wishlistNames = Array.from(selectedWishlists)
        .map(id => containingWishlists.find(w => w.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      setSuccessMessage(`Successfully removed from ${wishlistNames}`);
      setSelectedWishlists(new Set());
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const toggleWishlist = (wishlistId: string) => {
    const newSelected = new Set(selectedWishlists);
    if (newSelected.has(wishlistId)) {
      newSelected.delete(wishlistId);
    } else {
      newSelected.add(wishlistId);
    }
    setSelectedWishlists(newSelected);
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
        <View style={styles.content}>
          <Text variant="titleLarge" style={styles.title}>
            Remove from Wishlists
          </Text>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Text style={styles.subtitle}>
            Select the wishlists to remove this item from:
          </Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {containingWishlists.map((wishlist, index) => (
              <React.Fragment key={wishlist.id}>
                <List.Item
                  title={wishlist.name}
                  left={props => (
                    <Checkbox
                      status={selectedWishlists.has(wishlist.id) ? 'checked' : 'unchecked'}
                      onPress={() => toggleWishlist(wishlist.id)}
                    />
                  )}
                  onPress={() => toggleWishlist(wishlist.id)}
                  style={styles.listItem}
                />
                {index < containingWishlists.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleRemove}
              style={styles.removeButton}
              disabled={removeFromWishlist.isPending || selectedWishlists.size === 0}
              loading={removeFromWishlist.isPending}
              buttonColor={theme.colors.error}
            >
              Remove Selected
            </Button>
            <Button
              mode="text"
              onPress={onDismiss}
              style={styles.cancelButton}
              disabled={removeFromWishlist.isPending}
            >
              Done
            </Button>
          </View>
        </View>

        <Snackbar
          visible={!!successMessage}
          onDismiss={() => setSuccessMessage(null)}
          duration={2000}
        >
          {successMessage}
        </Snackbar>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    marginBottom: 12,
    color: '#666',
  },
  scrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 8,
  },
  removeButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 0,
  },
}); 