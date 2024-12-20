import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '@/types/supabase'

type Furniture = Database['public']['Tables']['furniture']['Row']

export type FilterCategory = 'new' | 'clearance' | 'type' | 'room' | 'brand' | null
export type FilterSubcategory = string | null
export type RoomType = 'living-room' | 'bedroom' | 'dining-room' | 'office' | null

interface ProductFilterState {
  // Main filter states
  category: FilterCategory
  subcategory: FilterSubcategory
  roomType: RoomType
  
  // Filter setters
  setCategory: (category: FilterCategory) => void
  setSubcategory: (subcategory: FilterSubcategory) => void
  setRoomType: (roomType: RoomType) => void
  clearFilters: () => void
  
  // Helper methods
  getFilterFunction: () => ((item: Furniture) => boolean) | null
  hasActiveFilters: () => boolean
  getFilterSummary: () => string
}

// Define filter mappings
const FILTER_MAPPINGS = {
  new: (item: Furniture) => item.new_product === true,
  clearance: (item: Furniture) => item.on_clearance === true,
  type: (item: Furniture, subcategory: string) => 
    Boolean(item.furniture_type?.toLowerCase().includes(subcategory.toLowerCase())),
  room: (item: Furniture, subcategory: string) => 
    Boolean(item.room_type?.toLowerCase().includes(subcategory.toLowerCase())),
  brand: (item: Furniture, subcategory: string) => 
    Boolean(item.brand?.toLowerCase().includes(subcategory.toLowerCase())),
}

// Define human-readable category names
const CATEGORY_NAMES = {
  new: 'New Arrivals',
  clearance: 'Clearance',
  type: 'Shop by Type',
  room: 'Shop by Room',
  brand: 'Shop by Brand',
}

export const useProductFilterStore = create<ProductFilterState>()(
  persist(
    (set, get) => ({
      // Initial state
      category: null,
      subcategory: null,
      roomType: null,

      // Setters
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

      setRoomType: (roomType) => {
        set({ roomType })
      },

      clearFilters: () => {
        set({
          category: null,
          subcategory: null,
          roomType: null
        })
      },

      // Helper methods
      getFilterFunction: () => {
        const { category, subcategory, roomType } = get()
        
        // Create an array to hold all active filter functions
        const filters: ((item: Furniture) => boolean)[] = []
        
        // Add category-based filter if active
        if (category) {
          if (category === 'new' || category === 'clearance') {
            filters.push(FILTER_MAPPINGS[category])
          } else if (subcategory && FILTER_MAPPINGS[category]) {
            filters.push((item: Furniture) => FILTER_MAPPINGS[category](item, subcategory))
          }
        }
        
        // Add room type filter if active
        if (roomType) {
          filters.push((item: Furniture) => 
            Boolean(item.room_type?.toLowerCase().includes(roomType.toLowerCase()))
          )
        }
        
        // If no filters are active, return null
        if (filters.length === 0) return null
        
        // Combine all filters with AND logic
        return (item: Furniture) => filters.every(filter => filter(item))
      },

      hasActiveFilters: () => {
        const { category, subcategory, roomType } = get()
        return !!(category || subcategory || roomType)
      },

      getFilterSummary: () => {
        const { category, subcategory, roomType } = get()
        const parts: string[] = []
        
        if (category) {
          const categoryName = CATEGORY_NAMES[category]
          parts.push(subcategory ? `${categoryName} • ${subcategory}` : categoryName)
        }
        
        if (roomType) {
          parts.push(`Room: ${roomType.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}`)
        }
        
        return parts.length > 0 ? parts.join(' | ') : 'All Products'
      },
    }),
    {
      name: 'product-filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
) 