import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginCredentials, SignupCredentials } from '@/types/auth';
import { apiClient } from '@/services/api/client';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const user: User = {
            id: '1',
            email: credentials.email,
            phoneNumber: '12345678901',
            createdAt: new Date().toISOString(),
          };
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (credentials) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const user: User = {
            id: '1',
            email: credentials.email,
            phoneNumber: credentials.phoneNumber,
            fullName: credentials.fullName,
            createdAt: new Date().toISOString(),
          };
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: async (userData) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ user: null, isAuthenticated: false });
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