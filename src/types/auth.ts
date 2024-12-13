export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  fullName?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials extends LoginCredentials {
  fullName: string;
  phoneNumber: string;
}