// lib/store/messStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Mess {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MEMBER";
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MessState {
  currentMess: Mess | null;
  userMesses: Mess[];
  isLoading: boolean;
  setCurrentMess: (mess: Mess) => void;
  setUserMesses: (messes: Mess[]) => void;
  setLoading: (loading: boolean) => void;
  switchMess: (messId: string) => void;
}

export const useMessStore = create<MessState>()(
  persist(
    (set, get) => ({
      currentMess: null,
      userMesses: [],
      isLoading: false,

      setCurrentMess: (mess) => {
        set({ currentMess: mess });
        if (typeof window !== "undefined") {
          localStorage.setItem("currentMessId", mess.id);
        }
      },

      setUserMesses: (messes) => {
        const persistedMess = get().currentMess;
        const currentMess =
          messes.find((mess) => mess.id === persistedMess?.id) ??
          messes[0] ??
          null;

        set({ userMesses: messes, currentMess });
        if (typeof window !== "undefined") {
          if (currentMess) {
            localStorage.setItem("currentMessId", currentMess.id);
          } else {
            localStorage.removeItem("currentMessId");
          }
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      switchMess: (messId) => {
        const mess = get().userMesses.find((m) => m.id === messId);
        if (mess) {
          set({ currentMess: mess });
          if (typeof window !== "undefined") {
            localStorage.setItem("currentMessId", messId);
          }
        }
      },
    }),
    {
      name: "mess-storage",
      partialize: (state) => ({
        currentMess: state.currentMess,
        userMesses: state.userMesses,
      }),
    },
  ),
);
