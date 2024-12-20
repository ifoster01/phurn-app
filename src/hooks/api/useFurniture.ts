import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useProductFilter } from '@/providers/ProductFilterProvider';
import { room_map, subcategory_map } from '@/constants/categories';

export type Furniture = Database['public']['Tables']['furniture']['Row'];

const ITEMS_PER_PAGE = 10;
const FURNITURE_QUERY_KEY = ['furniture', null, null, null] as const;

interface FurnitureResponse {
  items: Furniture[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number;
}

export function useFurniture() {
  const queryClient = useQueryClient();
  const { category, subcategory, roomType } = useProductFilter();

  const queryKey = [FURNITURE_QUERY_KEY[0], category, subcategory, roomType] as const;

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

      const formatted_subcategory = subcategory_map[subcategory as keyof typeof subcategory_map] || subcategory;
      const formatted_roomType = room_map[roomType as keyof typeof room_map] || roomType;

      // Apply category-based filters
      if (category === 'new') {
        query = query.eq('new_product', true);
      } else if (category === 'clearance') {
        query = query.eq('on_clearance', true);
      } else if (category && subcategory) {
        switch (category) {
          case 'type':
            if (subcategory === 'shop all furniture') {
              break;
            } else {
              if (formatted_subcategory === 'bed') {
                query = query.eq('furniture_type', formatted_subcategory);
              } else {
                query = query.ilike('furniture_type', `%${formatted_subcategory}%`);
              }
            }
            break;
          case 'room':
            query = query.ilike('room_type', `%${formatted_roomType}%`).ilike('furniture_type', `%${formatted_subcategory}%`);
            break;
          case 'brand':
            query = query.ilike('brand', `%${subcategory}%`);
            break;
        }
      }

      const { data, error, count } = await query.range(start, end);

      if (error) throw error;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

      return {
        items: data as Furniture[],
        totalCount,
        totalPages,
        hasNextPage: pageParam < totalPages,
        nextPage: pageParam + 1,
      };
    },
    getNextPageParam: (lastPage) => 
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    initialPageParam: 1,
  });

  const refetchWithReset = async () => {
    await queryClient.resetQueries({ queryKey: FURNITURE_QUERY_KEY });
    return query.refetch();
  };

  return { ...query, refetchWithReset };
} 