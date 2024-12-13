import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { WishListCard } from '@/components/wishlist/WishListCard';
import { useWishLists } from '@/hooks/useWishLists';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function WishListsScreen() {
  const { 
    wishLists, 
    isLoading, 
    refreshWishLists,
    navigateToWishList,
    createNewWishList,
  } = useWishLists();

  return (
    <SafeAreaWrapper>
      <Appbar.Header>
        <Appbar.Content title="Wish Lists" />
      </Appbar.Header>
      
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshWishLists} />
        }
      >
        {wishLists.map((wishList) => (
          <WishListCard
            key={wishList.id}
            wishList={wishList}
            onPress={() => navigateToWishList(wishList.id)}
          />
        ))}
        
        <TouchableOpacity
          style={styles.createButton}
          onPress={createNewWishList}
        >
          <Ionicons name="add" size={24} color="#666" />
          <Text style={styles.createButtonText}>Create New Wish List</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
});