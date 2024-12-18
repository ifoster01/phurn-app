import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/providers/AuthProvider';
import { useWishlists } from '@/hooks/api/useWishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { useNavigation } from '@react-navigation/native';

export function WishListsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { data: wishlistsData, isLoading } = useWishlists();

  const handleCreateSuccess = (name: string) => {
    setCreateModalVisible(false);
    // The wishlist will be created when the first item is added
  };

  const renderWishlistSection = (name: string, items: any[]) => {
    const thumbnails = items
      .slice(0, 4)
      .map(item => item.furniture.img_src_url)
      .filter(Boolean);

    return (
      <View key={name} style={styles.wishlistSection}>
        <View style={styles.wishlistHeader}>
          <View>
            <Text variant="titleLarge">{name}</Text>
            <Text variant="bodyMedium" style={styles.itemCount}>
              ({items.length})
            </Text>
          </View>
          <Button mode="text" textColor="#E85D3F">
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
        </View>

        <TouchableOpacity>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
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
            onPress={() => navigation.navigate('Profile' as never)}
            style={styles.signInButton}
          >
            Sign In
          </Button>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Wish Lists
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(wishlistsData?.groupedItems || {}).map(([name, items]) => 
            renderWishlistSection(name, items)
          )}
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
  title: {
    marginBottom: 8,
    color: '#E85D3F',
  },
  subtitle: {
    marginBottom: 24,
    color: '#666',
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
  editLink: {
    color: '#666',
    fontSize: 14,
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
});