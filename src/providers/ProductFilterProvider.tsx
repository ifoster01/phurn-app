import React, { createContext, useContext, useCallback } from 'react';
import { useProductFilterStore } from '@/stores/useProductFilterStore';
import type { FilterCategory, RoomType, FurnitureType, NavigationType } from '@/stores/useProductFilterStore';
import type { Database } from '@/types/supabase';

type Furniture = Database['public']['Tables']['furniture']['Row']

interface ProductFilterContextType {
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
  
  // Filtered data helper
  filterData: (data: Furniture[]) => Furniture[]
}

const ProductFilterContext = createContext<ProductFilterContextType | null>(null);

export function useProductFilter(): ProductFilterContextType {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error('useProductFilter must be used within a ProductFilterProvider');
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function ProductFilterProvider({ children }: Props) {
  const {
    navigationType,
    filterCategories,
    selectedRooms,
    selectedFurnitureTypes,
    selectedBrands,
    setNavigationType,
    addFilterCategory,
    removeFilterCategory,
    addRoom,
    removeRoom,
    addFurnitureType,
    removeFurnitureType,
    addBrand,
    removeBrand,
    clearNavigation,
    clearFilters,
    clearAll,
    getFilterFunction,
    hasActiveFilters,
    getFilterSummary,
  } = useProductFilterStore();

  // Helper method to filter data
  const filterData = useCallback((data: Furniture[]): Furniture[] => {
    const filterFn = getFilterFunction();
    if (!filterFn) return data;
    return data.filter(filterFn);
  }, [getFilterFunction]);

  const value: ProductFilterContextType = {
    navigationType,
    filterCategories,
    selectedRooms,
    selectedFurnitureTypes,
    selectedBrands,
    setNavigationType,
    addFilterCategory,
    removeFilterCategory,
    addRoom,
    removeRoom,
    addFurnitureType,
    removeFurnitureType,
    addBrand,
    removeBrand,
    clearNavigation,
    clearFilters,
    clearAll,
    getFilterFunction,
    hasActiveFilters,
    getFilterSummary,
    filterData,
  };

  return (
    <ProductFilterContext.Provider value={value}>
      {children}
    </ProductFilterContext.Provider>
  );
} 