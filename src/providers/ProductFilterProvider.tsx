import React, { createContext, useContext, useCallback } from 'react';
import { useProductFilterStore } from '@/stores/useProductFilterStore';
import type { FilterCategory, FilterSubcategory, RoomType } from '@/stores/useProductFilterStore';
import type { Database } from '@/types/supabase';

type Furniture = Database['public']['Tables']['furniture']['Row']

interface ProductFilterContextType {
  // Filter values
  category: FilterCategory;
  subcategory: FilterSubcategory;
  roomType: RoomType;
  
  // Filter setters
  setCategory: (category: FilterCategory) => void;
  setSubcategory: (subcategory: FilterSubcategory) => void;
  setRoomType: (roomType: RoomType) => void;
  clearFilters: () => void;
  
  // Helper methods
  getFilterFunction: () => ((item: Furniture) => boolean) | null;
  hasActiveFilters: () => boolean;
  getFilterSummary: () => string[];
  
  // Filtered data helper
  filterData: (data: Furniture[]) => Furniture[];
}

const ProductFilterContext = createContext<ProductFilterContextType | null>(null);

export function useProductFilter() {
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
    category,
    subcategory,
    roomType,
    setCategory: setStoreCategory,
    setSubcategory: setStoreSubcategory,
    setRoomType: setStoreRoomType,
    clearFilters,
    getFilterFunction,
    hasActiveFilters,
    getFilterSummary,
  } = useProductFilterStore();

  // Enhanced setters that can handle side effects
  const setCategory = useCallback((category: FilterCategory) => {
    setStoreCategory(category);
  }, [setStoreCategory]);

  const setSubcategory = useCallback((subcategory: FilterSubcategory) => {
    setStoreSubcategory(subcategory);
  }, [setStoreSubcategory]);

  const setRoomType = useCallback((roomType: RoomType) => {
    setStoreRoomType(roomType);
  }, [setStoreRoomType]);

  // Helper method to filter data
  const filterData = useCallback((data: Furniture[]) => {
    const filterFn = getFilterFunction();
    if (!filterFn) return data;
    return data.filter(filterFn);
  }, [getFilterFunction]);

  const value = {
    category,
    subcategory,
    roomType,
    setCategory,
    setSubcategory,
    setRoomType,
    clearFilters,
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