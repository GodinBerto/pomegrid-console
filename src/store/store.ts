import { create } from "zustand";

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
  roles: UserRole[];
  setAuth: (user: User, roles: UserRole[]) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  user: null,
  roles: [],
  setAuth: (user, roles) =>
    set({
      isLoggedIn: true,
      user,
      roles,
    }),
  logout: () =>
    set({
      isLoggedIn: false,
      user: null,
      roles: [],
    }),
}));
