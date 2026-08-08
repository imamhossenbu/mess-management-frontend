// lib/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  roomNumber?: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
        // Also set in localStorage for API client
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
      },

      setUser: (user) => {
        set({ user });
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // ✅ Logout - clears everything
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          document.cookie = "accessToken=; path=/; max-age=0";
        }
      },

      hydrate: () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");
          const userStr = localStorage.getItem("user");
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              set({ user, accessToken: token, isAuthenticated: true });
            } catch {
              // Invalid user data
            }
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          localStorage.setItem("accessToken", state.accessToken);
          if (state.user) {
            localStorage.setItem("user", JSON.stringify(state.user));
          }
        }
      },
    },
  ),
);
