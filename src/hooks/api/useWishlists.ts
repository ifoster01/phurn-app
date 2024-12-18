import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/providers/AuthProvider';

export type Wishlist = Database['public']['Tables']['wishlist']['Row'];

export function useWishlists() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wishlists', user?.id],
    queryFn: async () => {
      if (!user) return { items: [], groupedItems: {} };

      const { data: wishlistData, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          furniture (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Group items by wishlist name
      const groupedItems = (wishlistData as (Wishlist & { furniture: Database['public']['Tables']['furniture']['Row'] })[])
        .reduce((acc, item) => {
          const name = item.wishlist_name || 'My Wishlist';
          if (!acc[name]) {
            acc[name] = [];
          }
          acc[name].push(item);
          return acc;
        }, {} as Record<string, (Wishlist & { furniture: Database['public']['Tables']['furniture']['Row'] })[]>);

      return {
        items: wishlistData,
        groupedItems,
      };
    },
    enabled: !!user,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      furnitureId, 
      wishlistName 
    }: { 
      furnitureId: string; 
      wishlistName?: string;
    }) => {
      if (!user) throw new Error('Must be logged in to add to wishlist');

      const { data, error } = await supabase
        .from('wishlist')
        .insert([
          {
            furniture_id: furnitureId,
            user_id: user.id,
            wishlist_name: wishlistName,
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
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ wishlistId }: { wishlistId: string }) => {
      if (!user) throw new Error('Must be logged in to remove from wishlist');

      const { error } = await supabase
        .from('wishlist')
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

export function useCreateWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!user) throw new Error('Must be logged in to create wishlist');

      // Note: In our schema, wishlists are implicitly created when adding items
      // This is just a validation to ensure the name is unique
      const { data: existing, error: checkError } = await supabase
        .from('wishlist')
        .select('wishlist_name')
        .eq('user_id', user.id)
        .eq('wishlist_name', name)
        .limit(1);

      if (checkError) throw checkError;
      if (existing && existing.length > 0) {
        throw new Error('A wishlist with this name already exists');
      }

      return { name };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
} 