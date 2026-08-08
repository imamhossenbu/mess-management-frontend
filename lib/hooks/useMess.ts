/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useMess.ts
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessStore } from "@/lib/store/messStore";
import { messApi, Mess, Member } from "@/lib/api/mess";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const useMess = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    currentMess,
    userMesses,
    isLoading,
    setCurrentMess,
    setUserMesses,
    setLoading,
    switchMess,
  } = useMessStore();

  // Fetch user's messes
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = useQuery({
    queryKey: ["user-messes"],
    queryFn: async () => {
      const response = await messApi.getUserMesses();
      return response.data;
    },
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUserMesses(data);
    }
  }, [data, setUserMesses]);

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  // ==================== QUERIES ====================

  const useGetMess = (id: string) => {
    return useQuery({
      queryKey: ["mess", id],
      queryFn: async () => {
        const response = await messApi.getMess(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useGetMembers = (messId: string) => {
    return useQuery({
      queryKey: ["mess-members", messId],
      queryFn: async () => {
        const response = await messApi.getMembers(messId);
        return response.data;
      },
      enabled: !!messId,
    });
  };

  // ==================== MUTATIONS ====================

  const createMess = useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      address?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
      maxMembers?: number;
    }) => messApi.createMess(data),
    onSuccess: (response) => {
      const newMess = response.data;
      toast.success("Mess created successfully!");
      refetch();
      setCurrentMess(newMess);
      localStorage.setItem("currentMessId", newMess.id);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create mess");
    },
  });

  const updateMess = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Mess> }) =>
      messApi.updateMess(id, data),
    onSuccess: () => {
      toast.success("Mess updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-messes"] });
      queryClient.invalidateQueries({ queryKey: ["mess"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update mess");
    },
  });

  const deleteMess = useMutation({
    mutationFn: (id: string) => messApi.deleteMess(id),
    onSuccess: (_data, variables) => {
      toast.success("Mess deleted successfully!");
      refetch();
      if (currentMess && currentMess.id === variables) {
        const remainingMesses = userMesses.filter((m) => m.id !== variables);
        if (remainingMesses.length > 0) {
          setCurrentMess(remainingMesses[0]);
          localStorage.setItem("currentMessId", remainingMesses[0].id);
        } else {
          setCurrentMess(null as unknown as Mess);
          localStorage.removeItem("currentMessId");
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete mess");
    },
  });

  const addMember = useMutation({
    mutationFn: ({
      messId,
      data,
    }: {
      messId: string;
      data: { userId: string; role?: string };
    }) => messApi.addMember(messId, data),
    onSuccess: () => {
      toast.success("Member added successfully!");
      if (currentMess) {
        queryClient.invalidateQueries({
          queryKey: ["mess-members", currentMess.id],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add member");
    },
  });

  const removeMember = useMutation({
    mutationFn: ({ messId, userId }: { messId: string; userId: string }) =>
      messApi.removeMember(messId, userId),
    onSuccess: () => {
      toast.success("Member removed successfully!");
      if (currentMess) {
        queryClient.invalidateQueries({
          queryKey: ["mess-members", currentMess.id],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove member");
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: ({
      messId,
      userId,
      role,
    }: {
      messId: string;
      userId: string;
      role: string;
    }) => messApi.updateMemberRole(messId, userId, role),
    onSuccess: () => {
      toast.success("Role updated successfully!");
      if (currentMess) {
        queryClient.invalidateQueries({
          queryKey: ["mess-members", currentMess.id],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  // ==================== RETURN ====================

  return {
    currentMess,
    userMesses,
    isLoading,
    hasMess: userMesses.length > 0,
    setCurrentMess,
    switchMess,
    refetch,
    useGetMess,
    useGetMembers,
    createMess,
    updateMess,
    deleteMess,
    addMember,
    removeMember,
    updateMemberRole,
  };
};
