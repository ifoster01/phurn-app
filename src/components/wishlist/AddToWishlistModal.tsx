import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, List, useTheme, Divider, Snackbar } from 'react-native-paper';
import { useWishlists, useAddToWishlist, Wishlist } from '@/hooks/api/useWishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { RemoveFromWishlistModal } from './RemoveFromWishlistModal';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  furnitureId: string;
}

export function AddToWishlistModal({ visible, onDismiss, furnitureId }: Props) {
  const theme = useTheme();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: wishlistData } = useWishlists();
  const addToWishlist = useAddToWishlist();

  const handleAddToWishlist = async (wishlistId: string, wishlistName: string) => {
    // Check if item is already in this wishlist
    if (containingWishlists.some(w => w.id === wishlistId)) {
      setError('This item is already in this wishlist');
      setTimeout(() => setError(null), 2000);
      return;
    }

    try {
      setError(null);
      await addToWishlist.mutateAsync({
        wishlistId,
        furnitureId,
      });
      setSuccessMessage(`Successfully added to "${wishlistName}"`);
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

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
  };

  const wishlists = wishlistData?.wishlists || [];
  const hasWishlists = wishlists.length > 0;

  // Check which wishlists contain this item
  const containingWishlists = Object.values(wishlistData?.groupedItems || {}).filter(
    wishlist => wishlist.items.some(item => item.furniture_id === furnitureId)
  );

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
                {wishlists.map((wishlist: Wishlist, index) => {
                  const isInWishlist = containingWishlists.some(w => w.id === wishlist.id);
                  return (
                    <React.Fragment key={wishlist.id}>
                      <List.Item
                        title={wishlist.name}
                        left={props => (
                          <List.Icon 
                            {...props} 
                            icon={isInWishlist ? 'heart' : 'heart-outline'}
                            color={isInWishlist ? theme.colors.error : theme.colors.primary}
                          />
                        )}
                        onPress={() => handleAddToWishlist(wishlist.id, wishlist.name)}
                        disabled={addToWishlist.isPending || isInWishlist}
                        style={[
                          styles.listItem,
                          isInWishlist && styles.disabledListItem
                        ]}
                      />
                      {index < wishlists.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
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
              {containingWishlists.length > 0 && (
                <Button
                  mode="outlined"
                  onPress={() => setRemoveModalVisible(true)}
                  style={styles.removeButton}
                  textColor={theme.colors.error}
                >
                  Remove from Wishlist
                </Button>
              )}
              <Button
                mode="text"
                onPress={onDismiss}
                style={styles.cancelButton}
                disabled={addToWishlist.isPending}
              >
                Done
              </Button>
            </View>
          </View>
        </Modal>

        <Snackbar
          visible={!!successMessage}
          onDismiss={() => setSuccessMessage(null)}
          duration={2000}
        >
          {successMessage}
        </Snackbar>
      </Portal>

      <CreateWishlistModal
        visible={createModalVisible}
        onDismiss={() => setCreateModalVisible(false)}
        onCreateSuccess={handleCreateSuccess}
      />

      <RemoveFromWishlistModal
        visible={removeModalVisible}
        onDismiss={() => setRemoveModalVisible(false)}
        furnitureId={furnitureId}
        containingWishlists={containingWishlists}
        onRemoveSuccess={() => {
          setRemoveModalVisible(false);
        }}
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
  containingWishlists: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  containingWishlistsText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  wishlistName: {
    color: '#666',
    marginLeft: 8,
    marginTop: 2,
  },
  buttonContainer: {
    gap: 8,
  },
  createButton: {
    marginBottom: 8,
  },
  removeButton: {
    marginBottom: 8,
    borderColor: '#B00020',
  },
  cancelButton: {
    marginBottom: 0,
  },
  disabledListItem: {
    opacity: 0.5,
  },
}); 