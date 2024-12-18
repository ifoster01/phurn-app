import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: { email: string; password: string; phoneNumber?: string; fullName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) throw error;

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              phoneNumber: data.user.phone || '',
              createdAt: data.user.created_at!,
            };
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            phone: credentials.phoneNumber,
            options: {
              data: {
                full_name: credentials.fullName,
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              phoneNumber: credentials.phoneNumber,
              fullName: credentials.fullName,
              createdAt: data.user.created_at!,
            };
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Signup error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: async (userData) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.updateUser({
            email: userData.email,
            phone: userData.phoneNumber,
            data: {
              full_name: userData.fullName,
            },
          });

          if (error) throw error;

          if (data.user) {
            set((state) => ({
              user: state.user ? { ...state.user, ...userData } : null,
            }));
          }
        } catch (error) {
          console.error('Update user error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.admin.deleteUser(
            useAuthStore.getState().user?.id || ''
          );
          if (error) throw error;
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Delete account error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);