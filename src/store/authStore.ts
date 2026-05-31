import { create } from 'zustand';
import { AuthState } from '../types';

// Mock credentials — in production this would call a real auth endpoint
const MOCK_EMAIL = 'demo@taskmanager.com';
const MOCK_PASSWORD = 'password123';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      set({ isAuthenticated: true, user: { email } });
    } else {
      throw new Error('Invalid email or password. Try demo@taskmanager.com / password123');
    }
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
