import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, ActivityIndicator, Snackbar, IconButton } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/providers/AuthProvider';
import { useWishlists, useDeleteWishlist, Wishlist, WishlistItem } from '@/hooks/api/useWishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '@/navigation/types';
import { EditWishlistModal } from '@/components/wishlist/EditWishlistModal';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Wishlists'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface WishlistSectionProps {
  wishlist: Wishlist & { items: WishlistItem[] };
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
  onNavigate: (id: string) => void;
  onEdit: (id: string, name: string) => void;
}

function WishlistSection({ wishlist, onDelete, isDeleting, onNavigate, onEdit }: WishlistSectionProps) {
  const thumbnails = wishlist.items
    .slice(0, 4)
    .map(item => item.furniture.img_src_url)
    .filter(Boolean);

  return (
    <Animated.View 
      entering={FadeInDown.duration(400).springify()} 
      style={styles.wishlistSection}
    >
      <View style={styles.wishlistHeader}>
        <View>
          <Text variant="titleLarge">{wishlist.name}</Text>
          <Text variant="bodyMedium" style={styles.itemCount}>
            ({wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'})
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Button 
            mode="text"
            icon="pencil"
            onPress={() => onEdit(wishlist.id, wishlist.name)}
          >
            Edit
          </Button>
          <Button 
            mode="text" 
            textColor="#E85D3F"
            onPress={() => onNavigate(wishlist.id)}
          >
            View List
          </Button>
        </View>
      </View>

      <View style={styles.thumbnailGrid}>
        {thumbnails.map((url, index) => (
          <Animated.Image
            key={index}
            entering={FadeIn.delay(index * 100)}
            source={{ uri: url ?? '' }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ))}
        {thumbnails.length === 0 && (
          <View style={[styles.thumbnail, styles.emptyThumbnail]}>
            <Text variant="bodySmall" style={styles.emptyText}>No items yet</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        onPress={() => onDelete(wishlist.id)}
        disabled={isDeleting}
      >
        <Text style={[
          styles.deleteLink,
          isDeleting && styles.disabledLink
        ]}>
          Delete Wishlist
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function WishListsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<{ id: string; name: string } | null>(null);
  const { data: wishlistData, isLoading, isError, refetch } = useWishlists();
  const deleteWishlist = useDeleteWishlist();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
  };

  const handleDeleteWishlist = async (wishlistId: string, wishlistName: string) => {
    Alert.alert(
      'Delete Wishlist',
      `Are you sure you want to delete "${wishlistName}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWishlist.mutateAsync(wishlistId);
              setSuccessMessage(`Successfully deleted "${wishlistName}"`);
              setTimeout(() => setSuccessMessage(null), 2000);
            } catch (error) {
              console.error('Error deleting wishlist:', error);
              // TODO: Show error message to user
            }
          },
        },
      ]
    );
  };

  const handleNavigateToWishlist = (wishlistId: string) => {
    navigation.navigate('WishListDetail', { wishlistId });
  };

  const handleEditWishlist = (wishlistId: string, wishlistName: string) => {
    setSelectedWishlist({ id: wishlistId, name: wishlistName });
  };

  if (!user) {
    return (
      <SafeAreaWrapper>
        <Animated.View 
          entering={FadeInDown.duration(400).springify()} 
          style={[styles.container, styles.unauthContainer]}
        >
          <View style={styles.unauthContent}>
            <Text variant="headlineLarge" style={styles.unauthTitle}>
              Wish Lists
            </Text>
            <Text variant="titleMedium" style={styles.unauthSubtitle}>
              Create and manage your favorite furniture finds
            </Text>
            <Text style={styles.unauthDescription}>
              Sign in to start saving items to your wish lists and keep track of your dream furniture pieces
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Tabs', { screen: 'Profile' })}
              style={styles.signInButton}
              contentStyle={styles.signInButtonContent}
              labelStyle={styles.signInButtonLabel}
            >
              Sign In or Create Account
            </Button>
          </View>
        </Animated.View>
      </SafeAreaWrapper>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <Animated.View 
          entering={FadeIn.duration(400)} 
          style={[styles.container, styles.centerContent]}
        >
          <ActivityIndicator size="large" />
        </Animated.View>
      </SafeAreaWrapper>
    );
  }

  if (isError) {
    return (
      <SafeAreaWrapper>
        <Animated.View 
          entering={FadeIn.duration(400)} 
          style={[styles.container, styles.centerContent]}
        >
          <Text>Failed to load wishlists</Text>
          <Button 
            mode="contained" 
            style={styles.retryButton}
            onPress={() => refetch()}
            buttonColor="#EA3A00"
            textColor="white"
          >
            Retry
          </Button>
        </Animated.View>
      </SafeAreaWrapper>
    );
  }

  const hasWishlists = wishlistData && Object.keys(wishlistData.groupedItems).length > 0;

  return (
    <SafeAreaWrapper>
      <Animated.View 
        entering={FadeIn.duration(400)} 
        style={styles.container}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Wish Lists
        </Text>

        {!hasWishlists ? (
          <Animated.View 
            entering={FadeInDown.duration(400).springify()}
            style={styles.emptyStateContainer}
          >
            <Text style={styles.emptyStateText}>
              You haven't created any wishlists yet
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <View style={styles.createButtonContent}>
                <Text style={styles.createButtonText}>Create New Wish List</Text>
                <IconButton 
                  icon="plus" 
                  iconColor="#FFFFFF" 
                  size={24}
                  style={styles.createButtonIcon}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.entries(wishlistData?.groupedItems || {}).map(([wishlistId, wishlist], index) => (
                <WishlistSection
                  key={wishlistId}
                  wishlist={wishlist}
                  onDelete={(id) => handleDeleteWishlist(id, wishlist.name)}
                  isDeleting={deleteWishlist.isPending}
                  onNavigate={handleNavigateToWishlist}
                  onEdit={(id, name) => handleEditWishlist(id, name)}
                />
              ))}
            </ScrollView>

            <Animated.View 
              entering={FadeInDown.delay(300).springify()}
            >
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => setCreateModalVisible(true)}
              >
                <View style={styles.createButtonContent}>
                  <Text style={styles.createButtonText}>Create New Wish List</Text>
                  <IconButton 
                    icon="plus" 
                    iconColor="#FFFFFF" 
                    size={24}
                    style={styles.createButtonIcon}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <CreateWishlistModal
          visible={createModalVisible}
          onDismiss={() => setCreateModalVisible(false)}
          onCreateSuccess={handleCreateSuccess}
        />

        {selectedWishlist && (
          <EditWishlistModal
            visible={!!selectedWishlist}
            onDismiss={() => setSelectedWishlist(null)}
            wishlistId={selectedWishlist.id}
            currentName={selectedWishlist.name}
          />
        )}

        <Snackbar
          visible={!!successMessage}
          onDismiss={() => setSuccessMessage(null)}
          duration={2000}
          wrapperStyle={{ top: 0 }}
        >
          {successMessage}
        </Snackbar>
      </Animated.View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    color: '#666',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontSize: 16,
  },
  wishlistSection: {
    marginBottom: 32,
  },
  wishlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemCount: {
    color: '#666',
  },
  thumbnailGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  emptyThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
  deleteLink: {
    color: '#E85D3F',
    fontSize: 14,
  },
  disabledLink: {
    opacity: 0.5,
  },
  createButton: {
    paddingVertical: 10,
    backgroundColor: '#E85D3F',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  createButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unauthContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  unauthContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  unauthTitle: {
    color: '#E85D3F',
    marginBottom: 12,
    textAlign: 'center',
  },
  unauthSubtitle: {
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 20,
  },
  unauthDescription: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  signInButton: {
    width: '100%',
    borderRadius: 100,
    backgroundColor: '#E85D3F',
  },
  signInButtonContent: {
    paddingVertical: 8,
  },
  signInButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonIcon: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
});