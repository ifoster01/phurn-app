import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { useAuth } from '@/hooks/useAuth';
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
  const { isAuthenticated } = useAuth();
  const { favorites, loadFavorites } = useFavorites();
  const navigation = useNavigation<WishListsScreenNavigationProp>();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [loadFavorites, isAuthenticated]);

  const handleCreateWishlist = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to create and manage wishlists',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => {
              navigation.navigate('Tabs', {
                screen: 'Profile'
              });
            },
          },
        ]
      );
      return;
    }
    // Handle creating wishlist
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          My Wishlists
        </Text>
        
        {isAuthenticated ? (
          <>
            <Text style={styles.subtitle}>
              {favorites.size === 0
                ? 'No items in your wishlist yet'
                : `${favorites.size} items in your wishlist`}
            </Text>
            {/* TODO: Add wishlist items grid/list here */}
          </>
        ) : (
          <Text style={styles.subtitle}>
            Create wishlists to save your favorite items for later
          </Text>
        )}

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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});