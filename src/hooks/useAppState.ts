import { useStore } from '@/store';
import { shallow } from 'zustand/shallow';

export function useAppState() {
  const { isLoading, setIsLoading } = useStore(
    (state) => ({
      isLoading: state.isLoading,
      setIsLoading: state.setIsLoading,
    }),
    shallow
  );

  return { isLoading, setIsLoading };
}