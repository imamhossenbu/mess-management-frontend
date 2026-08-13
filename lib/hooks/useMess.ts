/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useMess.ts
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessStore } from "@/lib/store/messStore";
import { messApi, Mess } from "@/lib/api/mess";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const useMess = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    currentMess,
    userMesses,
    setCurrentMess,
    setUserMesses,
    switchMess,
  } = useMessStore();

  // ── Fetch user's mess list once (5min cache, no window focus refetch) ──
  const { data, refetch } = useQuery({
    queryKey: ["user-messes"],
    queryFn: async () => {
      const response = await messApi.getUserMesses();
      return response.data;
    },
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) setUserMesses(data);
  }, [data, setUserMesses]);

  // ──────── Queries ────────

  const useGetMembers = (messId?: string) =>
    useQuery({
      queryKey: ["mess-members", messId],
      queryFn: async () => (await messApi.getMembers(messId!)).data,
      enabled: !!user && !!messId,
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
    });

  // ──────── Mutations ────────

  const updateMess = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Mess> }) =>
      messApi.updateMess(id, data),
    onSuccess: () => {
      toast.success("Updated!");
      queryClient.invalidateQueries({ queryKey: ["user-messes"] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  const addMember = useMutation({
    mutationFn: ({ messId, data }: { messId: string; data: { name?: string; email?: string; password?: string; phone?: string; userId?: string; roles?: string[]; role?: string } }) =>
      messApi.addMember(messId, data),
    onSuccess: () => {
      toast.success("Member added!");
      if (currentMess) queryClient.invalidateQueries({ queryKey: ["mess-members", currentMess.id] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  const removeMember = useMutation({
    mutationFn: ({ messId, userId }: { messId: string; userId: string }) =>
      messApi.removeMember(messId, userId),
    onSuccess: () => {
      toast.success("Member removed!");
      if (currentMess) queryClient.invalidateQueries({ queryKey: ["mess-members", currentMess.id] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  const updateMemberRole = useMutation({
    mutationFn: ({ messId, userId, roles }: { messId: string; userId: string; roles: string[] }) =>
      messApi.updateMemberRole(messId, userId, roles),
    onSuccess: () => {
      toast.success("Role updated!");
      if (currentMess) queryClient.invalidateQueries({ queryKey: ["mess-members", currentMess.id] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  return {
    currentMess,
    userMesses,
    isLoading: false, // never block UI — mess loads silently
    hasMess: userMesses.length > 0,
    setCurrentMess,
    switchMess,
    refetch,
    useGetMembers,
    updateMess,
    addMember,
    removeMember,
    updateMemberRole,
  };
};
