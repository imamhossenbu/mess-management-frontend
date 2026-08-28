// lib/api/users.ts
import { apiClient } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  isActive: boolean;
  balance?: number;
  joinedDate?: string;
  createdAt?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const usersApi = {
  getAll: () => apiClient.get<User[]>("/users"),

  getOne: (id: string) => apiClient.get<User>(`/users/${id}`),

  create: (data: CreateUserData) => apiClient.post<User>("/users", data),

  update: (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
      isActive?: boolean;
    },
  ) => apiClient.patch<User>(`/users/manage/${id}`, data),

  // Update own profile
  updateProfile: (data: { name?: string; phone?: string; email?: string }) =>
    apiClient.patch<User>("/users/profile", data),

  // Upload profile image
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<{ profileImage: string }>("/users/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Remove profile image
  removeProfileImage: () => apiClient.delete("/users/profile/image"),

  // ✅ Soft delete (deactivate)
  deactivate: (id: string) => apiClient.delete(`/users/${id}`),

  // ✅ Hard delete (permanent)
  hardDelete: (id: string) => apiClient.delete(`/users/${id}/hard`),
};
