import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/providers/AuthProvider';
import { useWishlists, useDeleteWishlist, Wishlist, WishlistItem } from '@/hooks/api/useWishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '@/navigation/types';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Wishlists'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface WishlistSectionProps {
  wishlist: Wishlist & { items: WishlistItem[] };
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
  onNavigate: (id: string) => void;
}

function WishlistSection({ wishlist, onDelete, isDeleting, onNavigate }: WishlistSectionProps) {
  const thumbnails = wishlist.items
    .slice(0, 4)
    .map(item => item.furniture.img_src_url)
    .filter(Boolean);

  return (
    <View style={styles.wishlistSection}>
      <View style={styles.wishlistHeader}>
        <View>
          <Text variant="titleLarge">{wishlist.name}</Text>
          <Text variant="bodyMedium" style={styles.itemCount}>
            ({wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'})
          </Text>
        </View>
        <Button 
          mode="text" 
          textColor="#E85D3F"
          onPress={() => onNavigate(wishlist.id)}
        >
          View List
        </Button>
      </View>

      <View style={styles.thumbnailGrid}>
        {thumbnails.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
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
    </View>
  );
}

export function WishListsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { data: wishlistData, isLoading, isError, refetch } = useWishlists();
  const deleteWishlist = useDeleteWishlist();

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
  };

  const handleDeleteWishlist = async (wishlistId: string) => {
    try {
      await deleteWishlist.mutateAsync(wishlistId);
    } catch (error) {
      console.error('Error deleting wishlist:', error);
      // TODO: Show error message to user
    }
  };

  const handleNavigateToWishlist = (wishlistId: string) => {
    navigation.navigate('WishListDetail', { wishlistId });
  };

  if (!user) {
    return (
      <SafeAreaWrapper>
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>
            Wishlists
          </Text>
          <Text style={styles.subtitle}>
            Sign in to create and manage your wishlists
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Tabs', { screen: 'Profile' })}
            style={styles.signInButton}
          >
            Sign In
          </Button>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isError) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, styles.centerContent]}>
          <Text>Failed to load wishlists</Text>
          <Button 
            mode="contained" 
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            Retry
          </Button>
        </View>
      </SafeAreaWrapper>
    );
  }

  const hasWishlists = wishlistData && Object.keys(wishlistData.groupedItems).length > 0;

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Wish Lists
        </Text>

        {!hasWishlists && (
          <Text style={styles.emptyStateText}>
            You haven't created any wishlists yet
          </Text>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(wishlistData?.groupedItems || {}).map(([wishlistId, wishlist]) => (
            <WishlistSection
              key={wishlistId}
              wishlist={wishlist}
              onDelete={handleDeleteWishlist}
              isDeleting={deleteWishlist.isPending}
              onNavigate={handleNavigateToWishlist}
            />
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.createButtonText}>+ Create New Wish List</Text>
        </TouchableOpacity>

        <CreateWishlistModal
          visible={createModalVisible}
          onDismiss={() => setCreateModalVisible(false)}
          onCreateSuccess={handleCreateSuccess}
        />
      </View>
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
    marginBottom: 8,
    color: '#E85D3F',
  },
  subtitle: {
    marginBottom: 24,
    color: '#666',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 24,
  },
  wishlistSection: {
    marginBottom: 32,
  },
  wishlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 16,
  },
  createButtonText: {
    fontSize: 16,
    color: '#333',
  },
  signInButton: {
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
  },
});