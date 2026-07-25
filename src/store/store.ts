import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  role: UserRole | null;
  setAuth: (user: User, role: UserRole) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  user: null,
  role: null,
  setAuth: (user, role) => set({ isLoggedIn: true, user, role }),
  logout: () => set({ isLoggedIn: false, user: null, role: null }),
}));
