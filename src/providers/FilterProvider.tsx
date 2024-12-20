import React, { createContext, useContext, useCallback } from 'react';
import { useFilterStore } from '@/stores/useFilterStore';
import type { CategoryType, Category, Subcategory } from '@/stores/useFilterStore';

interface FilterContextType {
  // Filter values
  categoryType: CategoryType;
  category: Category;
  subcategory: Subcategory;
  
  // Filter setters
  setCategoryType: (type: CategoryType) => void;
  setCategory: (category: Category) => void;
  setSubcategory: (subcategory: Subcategory) => void;
  clearFilters: () => void;
  
  // UI state
  isFilterDrawerOpen: boolean;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  
  // Helper methods
  hasActiveFilters: () => boolean;
  getFilterSummary: () => string;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function FilterProvider({ children }: Props) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  
  // Get filter state and methods from Zustand store
  const {
    categoryType,
    category,
    subcategory,
    setCategoryType: setStoreType,
    setCategory: setStoreCategory,
    setSubcategory: setStoreSubcategory,
    clearFilters,
    hasActiveFilters
  } = useFilterStore();

  // Drawer controls
  const openFilterDrawer = useCallback(() => setIsFilterDrawerOpen(true), []);
  const closeFilterDrawer = useCallback(() => setIsFilterDrawerOpen(false), []);

  // Enhanced setters that can handle UI side effects
  const setCategoryType = useCallback((type: CategoryType) => {
    setStoreType(type);
    // Add any UI side effects here
  }, [setStoreType]);

  const setCategory = useCallback((category: Category) => {
    setStoreCategory(category);
    // Add any UI side effects here
  }, [setStoreCategory]);

  const setSubcategory = useCallback((subcategory: Subcategory) => {
    setStoreSubcategory(subcategory);
    // Add any UI side effects here
  }, [setStoreSubcategory]);

  // Helper method to get a human-readable summary of current filters
  const getFilterSummary = useCallback(() => {
    const parts: string[] = [];
    
    if (categoryType) {
      parts.push(categoryType === 'buy' ? 'For Sale' : 'For Rent');
    }
    
    if (category) {
      parts.push(category);
    }
    
    if (subcategory) {
      parts.push(subcategory);
    }
    
    return parts.join(' • ') || 'All Items';
  }, [categoryType, category, subcategory]);

  const value = {
    // Filter values
    categoryType,
    category,
    subcategory,
    
    // Filter setters
    setCategoryType,
    setCategory,
    setSubcategory,
    clearFilters,
    
    // UI state
    isFilterDrawerOpen,
    openFilterDrawer,
    closeFilterDrawer,
    
    // Helper methods
    hasActiveFilters,
    getFilterSummary,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
} 