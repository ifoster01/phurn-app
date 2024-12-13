import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

interface WishList {
  id: string;
  name: string;
  itemCount: number;
  thumbnails: string[];
}

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

const mockWishLists: WishList[] = [
  {
    id: '1',
    name: 'Apartment',
    itemCount: 8,
    thumbnails: [
      'https://example.com/thumbnail1.jpg',
      'https://example.com/thumbnail2.jpg',
      'https://example.com/thumbnail3.jpg',
      'https://example.com/thumbnail4.jpg',
    ],
  },
  {
    id: '2',
    name: 'Ski House',
    itemCount: 1,
    thumbnails: [
      'https://example.com/thumbnail5.jpg',
    ],
  },
  {
    id: '3',
    name: "Mom's House",
    itemCount: 1,
    thumbnails: [
      'https://example.com/thumbnail6.jpg',
    ],
  },
];

export function useWishLists() {
  const navigation = useNavigation<NavigationType>();
  const [isLoading, setIsLoading] = useState(false);
  const [wishLists, setWishLists] = useState<WishList[]>(mockWishLists);

  const refreshWishLists = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement actual API call
    } catch (error) {
      console.error('Error refreshing wish lists:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigateToWishList = useCallback((id: string) => {
    navigation.navigate('WishListDetail', { id });
  }, [navigation]);

  const createNewWishList = useCallback(async () => {
    try {
      // TODO: Implement create new wish list logic
      const newWishList: WishList = {
        id: String(Date.now()),
        name: 'New Wish List',
        itemCount: 0,
        thumbnails: [],
      };
      setWishLists((prev) => [...prev, newWishList]);
    } catch (error) {
      console.error('Error creating wish list:', error);
    }
  }, []);

  return {
    wishLists,
    isLoading,
    refreshWishLists,
    navigateToWishList,
    createNewWishList,
  };
}