import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: Set<string>;
  toggleFavorite: (productId: string) => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: new Set(),
      toggleFavorite: (productId) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
          } else {
            newFavorites.add(productId);
          }
          return { favorites: newFavorites };
        }),
    }),
    {
      name: 'favorites-storage',
    }
  )
);