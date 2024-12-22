import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '@/types/supabase'
import { subcategory_map, room_map } from '@/constants/categories'

type Furniture = Database['public']['Tables']['furniture']['Row']

// Navigation types
export type NavigationType = 'type' | 'room' | 'brand' | null
export type RoomType = keyof typeof room_map
export type FurnitureType = keyof typeof subcategory_map

// Filter types
export type FilterCategory = 'new' | 'clearance'

export const FILTER_NAMES = {
  new: 'New Arrivals',
  clearance: 'Clearance'
} as const

interface ProductFilterState {
  // Navigation state
  navigationType: NavigationType
  
  // Filter state
  filterCategories: FilterCategory[]
  selectedRooms: RoomType[]
  selectedFurnitureTypes: FurnitureType[]
  selectedBrands: string[]
  
  // Navigation setters
  setNavigationType: (type: NavigationType) => void
  
  // Filter setters
  addFilterCategory: (category: FilterCategory) => void
  removeFilterCategory: (category: FilterCategory) => void
  
  // Room setters
  addRoom: (room: RoomType) => void
  removeRoom: (room: RoomType) => void
  
  // Furniture type setters
  addFurnitureType: (type: FurnitureType) => void
  removeFurnitureType: (type: FurnitureType) => void
  
  // Brand setters
  addBrand: (brand: string) => void
  removeBrand: (brand: string) => void
  
  // Clear functions
  clearNavigation: () => void
  clearFilters: () => void
  clearAll: () => void
  
  // Helper methods
  getFilterFunction: () => ((item: Furniture) => boolean) | null
  hasActiveFilters: () => boolean
  getFilterSummary: () => string[]
}

// Define filter mappings
const FILTER_MAPPINGS = {
  new: (item: Furniture) => item.new_product === true,
  clearance: (item: Furniture) => item.on_clearance === true,
}

export const useProductFilterStore = create<ProductFilterState>()(
  persist(
    (set, get) => ({
      // Initial state
      navigationType: null,
      filterCategories: [],
      selectedRooms: [],
      selectedFurnitureTypes: [],
      selectedBrands: [],
      
      // Navigation setters
      setNavigationType: (type) => set({ navigationType: type }),
      
      // Filter setters
      addFilterCategory: (category) => {
        set((state) => ({
          filterCategories: [...new Set([...state.filterCategories, category])]
        }))
      },
      
      removeFilterCategory: (category) => {
        set((state) => ({
          filterCategories: state.filterCategories.filter(c => c !== category)
        }))
      },
      
      // Room setters
      addRoom: (room) => {
        set((state) => ({
          selectedRooms: [...new Set([...state.selectedRooms, room])]
        }))
      },
      
      removeRoom: (room) => {
        set((state) => ({
          selectedRooms: state.selectedRooms.filter(r => r !== room)
        }))
      },
      
      // Furniture type setters
      addFurnitureType: (type) => {
        set((state) => ({
          selectedFurnitureTypes: [...new Set([...state.selectedFurnitureTypes, type])]
        }))
      },
      
      removeFurnitureType: (type) => {
        set((state) => ({
          selectedFurnitureTypes: state.selectedFurnitureTypes.filter(t => t !== type)
        }))
      },
      
      // Brand setters
      addBrand: (brand) => {
        set((state) => ({
          selectedBrands: [...new Set([...state.selectedBrands, brand])]
        }))
      },
      
      removeBrand: (brand) => {
        set((state) => ({
          selectedBrands: state.selectedBrands.filter(b => b !== brand)
        }))
      },
      
      // Clear functions
      clearNavigation: () => {
        set({
          navigationType: null
        })
      },
      
      clearFilters: () => {
        set({
          filterCategories: [],
          selectedRooms: [],
          selectedFurnitureTypes: [],
          selectedBrands: []
        })
      },
      
      clearAll: () => {
        set({
          navigationType: null,
          filterCategories: [],
          selectedRooms: [],
          selectedFurnitureTypes: [],
          selectedBrands: []
        })
      },
      
      // Helper methods
      getFilterFunction: () => {
        const { filterCategories, selectedRooms, selectedFurnitureTypes, selectedBrands } = get()
        const filters: ((item: Furniture) => boolean)[] = []
        
        // Add category filters
        filterCategories.forEach(category => {
          if (FILTER_MAPPINGS[category]) {
            filters.push(FILTER_MAPPINGS[category])
          }
        })
        
        // Add room filter
        if (selectedRooms.length > 0) {
          filters.push((item: Furniture) => {
            if (!item.room_type) return false
            return selectedRooms.some(room => {
              const formattedRoom = room_map[room]
              return item.room_type?.toLowerCase().includes(formattedRoom.toLowerCase())
            })
          })
        }
        
        // Add furniture type filter
        if (selectedFurnitureTypes.length > 0) {
          filters.push((item: Furniture) => {
            if (!item.furniture_type) return false
            return selectedFurnitureTypes.some(type => {
              const formattedType = subcategory_map[type]
              return item.furniture_type?.toLowerCase() === formattedType.toLowerCase()
            })
          })
        }
        
        // Add brand filter
        if (selectedBrands.length > 0) {
          filters.push((item: Furniture) => {
            if (!item.brand) return false
            return selectedBrands.some(brand => 
              item.brand?.toLowerCase() === brand.toLowerCase()
            )
          })
        }
        
        if (filters.length === 0) return null
        return (item: Furniture) => filters.every(filter => filter(item))
      },
      
      hasActiveFilters: () => {
        const { filterCategories, selectedRooms, selectedFurnitureTypes, selectedBrands } = get()
        return (
          filterCategories.length > 0 || 
          selectedRooms.length > 0 || 
          selectedFurnitureTypes.length > 0 ||
          selectedBrands.length > 0
        )
      },
      
      getFilterSummary: () => {
        const { filterCategories, selectedRooms, selectedFurnitureTypes, selectedBrands } = get()
        const parts: string[] = []
        
        filterCategories.forEach(category => {
          parts.push(FILTER_NAMES[category])
        })
        
        selectedRooms.forEach(room => {
          parts.push(room.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '))
        })
        
        selectedFurnitureTypes.forEach(type => {
          parts.push(type.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' '))
        })
        
        selectedBrands.forEach(brand => {
          parts.push(brand)
        })
        
        return parts
      },
    }),
    {
      name: 'product-filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
) 