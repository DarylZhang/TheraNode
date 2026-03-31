import { create } from 'zustand';
import type { User } from '@/lib/api/types';

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,

  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('currentUser', JSON.stringify(user));
      else localStorage.removeItem('currentUser');
    }
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('currentUser');
      set({ user: stored ? (JSON.parse(stored) as User) : null, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },
}));
