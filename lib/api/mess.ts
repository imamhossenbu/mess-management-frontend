// lib/api/mess.ts
import { apiClient } from "./client";

export interface Mess {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  maxMembers?: number;
  role: "SUPER_ADMIN" | "ADMIN" | "MEMBER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userProfileImage?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MEMBER";
  joinedDate: string;
  balance: number;
}

export interface CreateMessData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  maxMembers?: number;
  logo?: string;
}

export interface UpdateMessData {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  maxMembers?: number;
  logo?: string;
  isActive?: boolean;
}

export const messApi = {
  // Get user's messes
  getUserMesses: () => apiClient.get<Mess[]>("/mess/user/messes"),

  // Get single mess details
  getMess: (id: string) => apiClient.get<Mess>(`/mess/${id}`),

  // Create mess
  createMess: (data: CreateMessData) => apiClient.post<Mess>("/mess", data),

  // Update mess
  updateMess: (id: string, data: UpdateMessData) =>
    apiClient.patch<Mess>(`/mess/${id}`, data),

  // Delete mess
  deleteMess: (id: string) => apiClient.delete(`/mess/${id}`),

  // Get members
  getMembers: (messId: string) =>
    apiClient.get<Member[]>(`/mess/${messId}/members`),

  // Add member
  addMember: (messId: string, data: { userId: string; role?: string }) =>
    apiClient.post(`/mess/${messId}/members`, data),

  // Remove member
  removeMember: (messId: string, userId: string) =>
    apiClient.delete(`/mess/${messId}/members/${userId}`),

  // Update member role
  updateMemberRole: (messId: string, userId: string, role: string) =>
    apiClient.patch(`/mess/${messId}/members/${userId}/role`, { role }),
};
