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
export type PriceSortType = 'none' | 'high-to-low' | 'low-to-high'
export type DiscountSortType = 'none' | 'highest-first'

export const FILTER_NAMES = {
  new: 'New Arrivals',
  clearance: 'Clearance'
} as const

export const SORT_NAMES: Record<PriceSortType | DiscountSortType, string> = {
  'none': 'No sorting',
  'high-to-low': 'Price: High to Low',
  'low-to-high': 'Price: Low to High',
  'highest-first': 'Biggest Discount First',
}

interface ProductFilterState {
  // Navigation state
  navigationType: NavigationType
  
  // Filter state
  filterCategories: FilterCategory[]
  selectedRooms: RoomType[]
  selectedFurnitureTypes: FurnitureType[]
  selectedBrands: string[]
  
  // New sorting state
  minPrice: number | null
  maxPrice: number | null
  priceSort: PriceSortType
  discountSort: DiscountSortType
  
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
  
  // New sorting actions
  setMinPrice: (price: number | null) => void
  setMaxPrice: (price: number | null) => void
  setPriceSort: (sort: PriceSortType) => void
  setDiscountSort: (sort: DiscountSortType) => void
  clearSorting: () => void
  hasActiveSorting: () => boolean
  getSortSummary: () => string
  
  // Add sorting function
  getSortFunction: () => ((a: Furniture, b: Furniture) => number) | null;
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
      minPrice: null,
      maxPrice: null,
      
      // New sorting state
      priceSort: 'none',
      discountSort: 'none',
      
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

      // Filter by price
      setMinPrice: (price) => set({ minPrice: price }),
      setMaxPrice: (price) => set({ maxPrice: price }),
      
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
          selectedBrands: [],
          priceSort: 'none',
          discountSort: 'none'
        })
      },
      
      clearAll: () => {
        set({
          navigationType: null,
          filterCategories: [],
          selectedRooms: [],
          selectedFurnitureTypes: [],
          selectedBrands: [],
          priceSort: 'none',
          discountSort: 'none'
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
      
      // New sorting actions
      setPriceSort: (sort) =>
        set((state) => ({
          priceSort: sort,
          // Clear discount sort if price sort is set
          discountSort: sort === 'none' ? state.discountSort : 'none',
        })),
      setDiscountSort: (sort) =>
        set((state) => ({
          discountSort: sort,
          // Clear price sort if discount sort is set
          priceSort: sort === 'none' ? state.priceSort : 'none',
        })),
      clearSorting: () =>
        set({
          priceSort: 'none',
          discountSort: 'none',
        }),
      hasActiveSorting: () => {
        const state = get()
        return state.priceSort !== 'none' || state.discountSort !== 'none'
      },
      getSortSummary: () => {
        const state = get()
        if (state.priceSort !== 'none') {
          return SORT_NAMES[state.priceSort]
        }
        if (state.discountSort !== 'none') {
          return SORT_NAMES[state.discountSort]
        }
        return ''
      },
      
      // Add sorting function
      getSortFunction: () => {
        const { priceSort, discountSort } = get();
        
        if (priceSort !== 'none') {
          return (a: Furniture, b: Furniture) => {
            const priceA = a.current_price || 0;
            const priceB = b.current_price || 0;
            return priceSort === 'high-to-low' ? priceB - priceA : priceA - priceB;
          };
        }
        
        if (discountSort !== 'none') {
          return (a: Furniture, b: Furniture) => {
            const discountA = a.regular_price && a.current_price 
              ? ((a.regular_price - a.current_price) / a.regular_price) * 100 
              : 0;
            const discountB = b.regular_price && b.current_price 
              ? ((b.regular_price - b.current_price) / b.regular_price) * 100 
              : 0;
            return discountSort === 'highest-first' 
              ? discountB - discountA 
              : discountA - discountB;
          };
        }
        
        return null;
      },
    }),
    {
      name: 'product-filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
) 