import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface FavoritesState {
  favorites: Set<string>;
  toggleFavorite: (productId: string) => Promise<boolean>;
  loadFavorites: () => Promise<void>;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: new Set(),

      toggleFavorite: async (productId: string) => {
        const { requireAuth } = useAuth();
        let success = false;

        const toggleAction = async () => {
          const currentFavorites = new Set(get().favorites);
          const isAdding = !currentFavorites.has(productId);

          try {
            if (isAdding) {
              const { error } = await supabase
                .from('favorites')
                .insert([{ product_id: productId }]);
              if (error) throw error;
              currentFavorites.add(productId);
            } else {
              const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('product_id', productId);
              if (error) throw error;
              currentFavorites.delete(productId);
            }

            set({ favorites: currentFavorites });
            success = true;
          } catch (error) {
            console.error('Error toggling favorite:', error);
            success = false;
          }
        };

        await requireAuth(toggleAction, 'Please sign in to save items to your wishlist');
        return success;
      },

      loadFavorites: async () => {
        const { isAuthenticated } = useAuth();
        if (!isAuthenticated) {
          set({ favorites: new Set() });
          return;
        }

        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('product_id');
          
          if (error) throw error;

          const favoriteIds = new Set(data.map(item => item.product_id));
          set({ favorites: favoriteIds });
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);