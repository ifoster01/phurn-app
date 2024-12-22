import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useProductFilter } from '@/providers/ProductFilterProvider';
import { categories, room_map, subcategory_map } from '@/constants/categories';

export type Furniture = Database['public']['Tables']['furniture']['Row'];

const ITEMS_PER_PAGE = 10;
const FURNITURE_QUERY_KEY = ['furniture'] as const;

interface FurnitureResponse {
  items: Furniture[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number;
}

export function useFurniture() {
  const queryClient = useQueryClient();
  const { 
    navigationType,
    selectedRooms,
    selectedFurnitureTypes,
    selectedBrands,
    filterCategories,
  } = useProductFilter();

  const queryKey = [
    FURNITURE_QUERY_KEY[0],
    {
      navigationType,
      selectedRooms,
      selectedFurnitureTypes,
      selectedBrands,
      filterCategories
    }
  ] as const;

  const query = useInfiniteQuery<
    FurnitureResponse,
    Error,
    { pages: FurnitureResponse[] },
    typeof queryKey,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('furniture')
        .select('*', { count: 'exact' });

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
        query = query.in('brand', categories['brand'].filter(brand => selectedBrands.includes(brand.id)).map(brand => brand.title));
      }

      // Execute query with pagination
      const { data, error, count } = await query
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
      const nextPage = start + ITEMS_PER_PAGE < totalCount ? pageParam + 1 : null;

      return {
        items: data || [],
        totalCount,
        totalPages,
        hasNextPage: Boolean(nextPage),
        nextPage: nextPage || pageParam,
      };
    },
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
    initialPageParam: 1,
  });

  return {
    ...query,
    refetchWithReset: async () => {
      await queryClient.resetQueries({ queryKey });
      return query.refetch();
    },
  };
} 