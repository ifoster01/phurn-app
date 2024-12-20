import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type CategoryType = 'buy' | 'rent' | null
export type Category = string | null
export type Subcategory = string | null

interface FilterState {
  categoryType: CategoryType
  category: Category
  subcategory: Subcategory
  setCategoryType: (type: CategoryType) => void
  setCategory: (category: Category) => void
  setSubcategory: (subcategory: Subcategory) => void
  clearFilters: () => void
  // Helper method to check if any filters are active
  hasActiveFilters: () => boolean
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      categoryType: null,
      category: null,
      subcategory: null,

      setCategoryType: (type) => {
        set({ 
          categoryType: type,
          // Reset child filters when parent changes
          category: null,
          subcategory: null
        })
      },

      setCategory: (category) => {
        set({ 
          category,
          // Reset subcategory when category changes
          subcategory: null
        })
      },

      setSubcategory: (subcategory) => {
        set({ subcategory })
      },

      clearFilters: () => {
        set({
          categoryType: null,
          category: null,
          subcategory: null
        })
      },

      hasActiveFilters: () => {
        const state = get()
        return !!(state.categoryType || state.category || state.subcategory)
      }
    }),
    {
      name: 'filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
) 