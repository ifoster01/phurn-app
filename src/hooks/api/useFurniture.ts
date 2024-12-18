import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

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

  const query = useInfiniteQuery<FurnitureResponse, Error, { pages: FurnitureResponse[] }, typeof FURNITURE_QUERY_KEY, number>({
    queryKey: FURNITURE_QUERY_KEY,
    queryFn: async ({ pageParam }) => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('furniture')
        .select('*', { count: 'exact' })
        .range(start, end);

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