import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useProductFilterStore } from '@/stores/useProductFilterStore';
import { categories, room_map, subcategory_map } from '@/constants/categories';

type Tables = Database['public']['Tables'];
type FurnitureTable = Tables['furniture']['Row'];

export interface Furniture extends FurnitureTable {
  discount_percentage: number;
}

const ITEMS_PER_PAGE = 10;

interface FurnitureResponse {
  items: Furniture[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number;
}

interface FurnitureQueryParams {
  searchQuery?: string;
}

export function useFurniture(params?: FurnitureQueryParams) {
  const queryClient = useQueryClient();
  const { 
    navigationType,
    selectedRooms,
    selectedFurnitureTypes,
    selectedBrands,
    filterCategories,
    priceSort,
    discountSort,
    minPrice,
    maxPrice,
  } = useProductFilterStore();

  return useInfiniteQuery({
    queryKey: ['furniture', {
      navigationType,
      selectedRooms,
      selectedFurnitureTypes,
      selectedBrands,
      filterCategories,
      searchQuery: params?.searchQuery,
      priceSort,
      discountSort,
      minPrice,
      maxPrice,
    }] as const,
    
    queryFn: async ({ pageParam = 1 }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('furniture')
        .select('*', { count: 'exact' });

      // Apply search query if present
      if (params?.searchQuery) {
        query = query.or(`name.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`);
      }

      // Apply category filters
      filterCategories.forEach(category => {
        if (category === 'new') {
          query = query.eq('new_product', true);
        } else if (category === 'clearance') {
          query = query.eq('on_clearance', true);
        }
      });

      // Apply room filters
      if (selectedRooms.length > 0) {
        const roomConditions = selectedRooms.map(room => {
          const formattedRoom = room_map[room];
          return `room_type.ilike.%${formattedRoom}%`;
        });
        query = query.or(roomConditions.join(','));
      }

      // Apply furniture type filters
      if (selectedFurnitureTypes.length > 0) {
        const typeConditions = selectedFurnitureTypes.map(type => {
          const formattedType = subcategory_map[type];
          return `furniture_type.eq.${formattedType}`;
        });
        query = query.or(typeConditions.join(','));
      }

      // Apply brand filters
      if (selectedBrands.length > 0) {
        query = query.in('brand', categories['brand']
          .filter(brand => selectedBrands.includes(brand.id))
          .map(brand => brand.title)
        );
      }

      // Apply price range filters
      if (minPrice !== null || maxPrice !== null) {
        query = query.gte('current_price', minPrice ?? 0)
          .lte('current_price', maxPrice ?? 999999);
      }

      // Apply sorting
      if (priceSort !== 'none') {
        query = query.order('current_price', {
          ascending: priceSort === 'low-to-high',
          nullsFirst: false
        });
      } else if (discountSort === 'highest-first') {
        query = query
          .not('discount_percent', 'is', null)
          .order('discount_percent', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query
        .returns<FurnitureTable[]>()
        .range(start, end);

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }

      // Use the database discount_percent for consistency
      const processResults = (items: FurnitureTable[]): Furniture[] => {
        return items.map(item => ({
          ...item,
          discount_percentage: item.discount_percent ?? 0
        }));
      };

      const totalCount = count ?? 0;
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      const nextPage = start + ITEMS_PER_PAGE < totalCount ? pageParam + 1 : null;

      return {
        items: processResults(data ?? []),
        totalCount,
        totalPages,
        hasNextPage: Boolean(nextPage),
        nextPage: nextPage ?? pageParam,
      };
    },

    initialPageParam: 1,
    
    getNextPageParam: (lastPage) => 
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });
} 