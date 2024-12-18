import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, List, useTheme, Divider } from 'react-native-paper';
import { useWishlists, useAddToWishlist, Wishlist } from '@/hooks/api/useWishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  furnitureId: string;
}

export function AddToWishlistModal({ visible, onDismiss, furnitureId }: Props) {
  const theme = useTheme();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: wishlistData } = useWishlists();
  const addToWishlist = useAddToWishlist();

  const handleAddToWishlist = async (wishlistId: string) => {
    try {
      setError(null);
      await addToWishlist.mutateAsync({
        wishlistId,
        furnitureId,
      });
      onDismiss();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
  };

  const wishlists = wishlistData?.wishlists || [];
  const hasWishlists = wishlists.length > 0;

  return (
    <>
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
              Add to Wishlist
            </Text>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {hasWishlists ? (
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {wishlists.map((wishlist: Wishlist, index) => (
                  <React.Fragment key={wishlist.id}>
                    <List.Item
                      title={wishlist.name}
                      left={props => <List.Icon {...props} icon="heart-outline" color={theme.colors.primary} />}
                      onPress={() => handleAddToWishlist(wishlist.id)}
                      disabled={addToWishlist.isPending}
                      style={styles.listItem}
                    />
                    {index < wishlists.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>No wishlists yet. Create your first one!</Text>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => setCreateModalVisible(true)}
                style={styles.createButton}
                disabled={addToWishlist.isPending}
              >
                Create New Wishlist
              </Button>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.cancelButton}
                disabled={addToWishlist.isPending}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      <CreateWishlistModal
        visible={createModalVisible}
        onDismiss={() => setCreateModalVisible(false)}
        onCreateSuccess={handleCreateSuccess}
      />
    </>
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
  scrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 24,
    opacity: 0.7,
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 8,
  },
  createButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 0,
  },
}); 