import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Portal, Text, Button, List, useTheme, Divider, Snackbar } from 'react-native-paper';
import { useWishlists, useAddToWishlist, useRemoveFromWishlist, Wishlist } from '@/hooks/api/useWishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  furnitureId: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AddToWishlistDrawer({ visible, onDismiss, furnitureId }: Props) {
  const theme = useTheme();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: wishlistData } = useWishlists();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  
  // Bottom sheet reference
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Variables
  const snapPoints = useMemo(() => ['70%'], []);

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onDismiss();
    }
  }, [onDismiss]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Effects
  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleToggleWishlist = async (wishlistId: string, wishlistName: string, isInWishlist: boolean) => {
    try {
      setError(null);
      
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist.mutateAsync({
          wishlistId,
          furnitureId,
        });
        setSuccessMessage(`Removed from "${wishlistName}"`);
      } else {
        // Add to wishlist
        await addToWishlist.mutateAsync({
          wishlistId,
          furnitureId,
        });
        setSuccessMessage(`Added to "${wishlistName}"`);
      }

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

  const isPending = addToWishlist.isPending || removeFromWishlist.isPending;

  return (
    <>
      <Portal>
        <GestureHandlerRootView style={styles.gestureRoot}>
          <BottomSheet
            ref={bottomSheetRef}
            index={visible ? 0 : -1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={styles.handle}
            backgroundStyle={styles.drawerContent}
          >
            <BottomSheetView style={styles.content}>
              <Text variant="titleLarge" style={styles.title}>
                Wishlists
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
                          onPress={() => handleToggleWishlist(wishlist.id, wishlist.name, isInWishlist)}
                          disabled={isPending}
                          style={styles.listItem}
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
                  disabled={isPending}
                >
                  Create New Wishlist
                </Button>
                <Button
                  mode="text"
                  onPress={onDismiss}
                  style={styles.cancelButton}
                  disabled={isPending}
                >
                  Done
                </Button>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </GestureHandlerRootView>

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
    </>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  drawerContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
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
    marginTop: 'auto',
  },
  createButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 0,
  },
}); 