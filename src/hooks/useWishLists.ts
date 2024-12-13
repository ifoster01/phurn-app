import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { WishList } from '@/types/wishlist';

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
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [wishLists, setWishLists] = useState<WishList[]>(mockWishLists);

  const refreshWishLists = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  const navigateToWishList = useCallback((id: string) => {
    navigation.navigate('WishListDetail', { id });
  }, [navigation]);

  const createNewWishList = useCallback(() => {
    // Implement create new wish list logic
  }, []);

  return {
    wishLists,
    isLoading,
    refreshWishLists,
    navigateToWishList,
    createNewWishList,
  };
}