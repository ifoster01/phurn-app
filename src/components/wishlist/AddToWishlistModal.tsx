import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, List, useTheme } from 'react-native-paper';
import { useWishlists, useAddToWishlist } from '@/hooks/api/useWishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  furnitureId: string;
}

export function AddToWishlistModal({ visible, onDismiss, furnitureId }: Props) {
  const theme = useTheme();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { data: wishlistsData } = useWishlists();
  const addToWishlist = useAddToWishlist();

  const handleAddToWishlist = async (wishlistName?: string) => {
    try {
      await addToWishlist.mutateAsync({
        furnitureId,
        wishlistName,
      });
      onDismiss();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const existingWishlistNames = Object.keys(wishlistsData?.groupedItems || {});

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
          <Text variant="titleLarge" style={styles.title}>
            Add to Wishlist
          </Text>

          <ScrollView style={styles.scrollView}>
            <List.Item
              title="My Wishlist"
              left={props => <List.Icon {...props} icon="heart" />}
              onPress={() => handleAddToWishlist()}
            />
            
            {existingWishlistNames.map((name) => (
              name !== 'My Wishlist' && (
                <List.Item
                  key={name}
                  title={name}
                  left={props => <List.Icon {...props} icon="heart" />}
                  onPress={() => handleAddToWishlist(name)}
                />
              )
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => setCreateModalVisible(true)}
              style={styles.button}
            >
              Create New Wishlist
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

      <CreateWishlistModal
        visible={createModalVisible}
        onDismiss={() => setCreateModalVisible(false)}
        onCreateSuccess={(name) => {
          setCreateModalVisible(false);
          handleAddToWishlist(name);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 300,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 8,
  },
  button: {
    marginVertical: 4,
  },
}); 