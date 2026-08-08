/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api/users.ts
import { apiClient } from "./client";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  roomNumber?: string;
  profileImage?: string;
  isActive: boolean;
  joinedDate: string;
  balance?: number;
}

export const usersApi = {
  getAll: () => apiClient.get<User[]>("/users"),

  getById: (id: string) => apiClient.get<User>(`/users/${id}`),

  create: (data: any) => apiClient.post<User>("/users", data),

  update: (id: string, data: any) =>
    apiClient.patch<User>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/${id}`),

  hardDelete: (id: string) => apiClient.delete(`/users/${id}/hard`),

  updateProfile: (data: any) => apiClient.patch("/users/profile", data),

  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/users/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  removeProfileImage: () => apiClient.delete("/users/profile/image"),
};
