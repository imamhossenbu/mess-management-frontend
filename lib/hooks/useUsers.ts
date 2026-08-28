/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import toast from "react-hot-toast";

export interface Member {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  role: string;
  balance: number;
  joinedDate: string;
  profileImage?: string;
}

export function useUsers() {
  const queryClient = useQueryClient();

  // Get all users (members)
  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await usersApi.getAll();
      return response.data.map((user: any) => ({
        id: user.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || "",
        role: user.role || "MEMBER",
        balance: user.balance || 0,
        joinedDate: user.joinedDate || user.createdAt,
        profileImage: user.profileImage,
        isActive: user.isActive !== false, // default true
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const addMember = useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
      password: string;
    }) => {
      const response = await usersApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Member added successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to add member";
      toast.error(message);
      throw error;
    },
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const response = await usersApi.hardDelete(userId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Member deleted permanently!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete member";
      toast.error(message);
      throw error;
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await usersApi.update(userId, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update role";
      toast.error(message);
      throw error;
    },
  });

  const updateMemberStatus = useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: string;
      isActive: boolean;
    }) => {
      const response = await usersApi.update(userId, { isActive });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Member status updated!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update status";
      toast.error(message);
      throw error;
    },
  });

  const deactivateMember = useMutation({
    mutationFn: async (userId: string) => {
      const response = await usersApi.deactivate(userId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Member deactivated!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to deactivate member";
      toast.error(message);
      throw error;
    },
  });

  return {
    members,
    isLoading,
    error,
    refetch,
    addMember,
    removeMember,
    updateMemberRole,
    updateMemberStatus,
    deactivateMember,
    isRemoving: removeMember.isPending,
  };
}
