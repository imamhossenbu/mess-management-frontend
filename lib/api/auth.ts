/* eslint-disable @next/next/no-location-assign-relative-destination */
// src/lib/api/auth.ts
import { apiClient } from "./client";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  roomNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string; // ✅ required korlam, kintu empty string dite pari
    role: string;
    roomNumber?: string;
    profileImage?: string;
  };
}

export const authApi = {
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  login: (data: LoginData) => apiClient.post<AuthResponse>("/auth/login", data),

  getProfile: () => apiClient.get("/auth/profile"),

  googleLogin: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },
};
