import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/providers/AuthProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '@/navigation/types';

type WishListsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'WishLists'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function WishListsScreen() {
  const { user } = useAuth();
  const { favorites, loadFavorites } = useFavorites();
  const navigation = useNavigation<WishListsScreenNavigationProp>();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [loadFavorites, user]);

  const handleCreateWishlist = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to create and manage your wishlists',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Profile'),
          },
        ]
      );
      return;
    }
    // TODO: Implement wishlist creation
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Wishlists
        </Text>
        
        <Text style={styles.subtitle}>
          {user ? (
            favorites.size === 0
              ? 'No items in your wishlist yet'
              : `${favorites.size} items in your wishlist`
          ) : (
            'Sign in to create and manage your own wishlists'
          )}
        </Text>

        {/* TODO: Add public wishlist items grid/list here */}
        {/* This section would show public wishlists that anyone can view */}
        <Text style={styles.sectionTitle}>
          Popular Wishlists
        </Text>
        {/* Add your public wishlist display components here */}

        <FAB
          icon="plus"
          label="Create Wishlist"
          onPress={handleCreateWishlist}
          style={styles.fab}
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
  },
  subtitle: {
    marginBottom: 24,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});