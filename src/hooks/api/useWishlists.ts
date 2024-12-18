import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

export interface Wishlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  furniture_id: string;
  user_id: string;
  created_at: string;
  furniture: {
    id: string;
    name: string;
    img_src_url: string;
    current_price: number;
    brand: string;
  };
}

export function useWishlists() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['wishlists', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // First get all wishlists
      const { data: wishlists, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (wishlistError) throw wishlistError;

      // Then get all wishlist items with furniture details
      const { data: wishlistItems, error: itemsError } = await supabase
        .from('user_wishlist')
        .select(`
          *,
          furniture (
            id,
            name,
            img_src_url,
            current_price,
            brand
          )
        `)
        .eq('user_id', user.id);

      if (itemsError) throw itemsError;

      // Group items by wishlist
      const groupedItems = (wishlists as Wishlist[]).reduce((acc, wishlist) => {
        acc[wishlist.id] = {
          ...wishlist,
          items: (wishlistItems as WishlistItem[]).filter(
            item => item.wishlist_id === wishlist.id
          ),
        };
        return acc;
      }, {} as Record<string, Wishlist & { items: WishlistItem[] }>);

      return {
        wishlists: wishlists as Wishlist[],
        groupedItems,
      };
    },
    enabled: !!user,
  });
}

export function useCreateWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Check if wishlist with same name exists
      const { data: existing } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name)
        .single();

      if (existing) {
        throw new Error('A wishlist with this name already exists');
      }

      const { data, error } = await supabase
        .from('wishlists')
        .insert([
          {
            name,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      console.log('data', data);
      console.log('error', error);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useDeleteWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wishlistId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Delete all items in the wishlist first
      const { error: itemsError } = await supabase
        .from('user_wishlist')
        .delete()
        .eq('wishlist_id', wishlistId)
        .eq('user_id', user.id);

      if (itemsError) throw itemsError;

      // Then delete the wishlist
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useAddToWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wishlistId,
      furnitureId,
    }: {
      wishlistId: string;
      furnitureId: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_wishlist')
        .insert([
          {
            wishlist_id: wishlistId,
            furniture_id: furnitureId,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wishlistId,
      furnitureId,
    }: {
      wishlistId: string;
      furnitureId: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_wishlist')
        .delete()
        .eq('wishlist_id', wishlistId)
        .eq('furniture_id', furnitureId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
} 