// lib/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: () => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,

      setAuth: (user, token) => {
        console.log("🔐 setAuth called - User:", user?.name);
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
          _hasHydrated: true,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=604800; SameSite=Lax`;
        }
      },

      setUser: (user) => {
        const currentUser = get().user;
        if (JSON.stringify(currentUser) === JSON.stringify(user)) {
          return;
        }
        set({ user });
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
          document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=604800; SameSite=Lax`;
        }
      },

      setLoading: (loading) => {
        const currentLoading = get().isLoading;
        if (currentLoading === loading) return;
        set({ isLoading: loading });
      },

      setHydrated: () => {
        console.log("💧 Hydration complete");
        set({ _hasHydrated: true, isLoading: false });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          _hasHydrated: true,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          document.cookie = "accessToken=; path=/; max-age=0";
          document.cookie = "user=; path=/; max-age=0";
        }
      },

      hydrate: () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");
          const userStr = localStorage.getItem("user");
          console.log(
            "💧 Hydrating - Token:",
            token ? "✅ Exists" : "❌ Missing",
          );

          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              console.log("✅ Parsed User:", user?.name);
              set({
                user,
                accessToken: token,
                isAuthenticated: true,
                isLoading: false,
                _hasHydrated: true,
              });
              console.log("✅ Hydration successful - User:", user?.name);
            } catch (error) {
              console.error("❌ Hydration failed:", error);
              set({ isLoading: false, _hasHydrated: true });
            }
          } else {
            console.log("ℹ️ No stored auth data found");
            set({ isLoading: false, _hasHydrated: true });
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
        console.log("🔄 Rehydrating storage...");
        if (state?.accessToken) {
          console.log("✅ Rehydration found token");
          console.log("✅ User from rehydrate:", state?.user?.name);
        }
      },
    },
  ),
);
