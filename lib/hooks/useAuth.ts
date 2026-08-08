/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { authApi, LoginData, RegisterData } from "../api/auth";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading: authLoading,
    setAuth,
    setUser,
    logout: storeLogout,
    setLoading,
  } = useAuthStore();

  // ==================== LOGIN ====================

  const login = useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      setAuth(user, accessToken);
      queryClient.setQueryData(["profile"], user);
      toast.success("Welcome back!");
      setLoading(false);
      router.push("/select-mess");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
    },
  });

  // ==================== REGISTER ====================

  const register = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      setAuth(user, accessToken);
      queryClient.setQueryData(["profile"], user);
      toast.success("Account created successfully!");
      setLoading(false);
      router.push("/select-mess");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
      setLoading(false);
    },
  });

  // ==================== PROFILE ====================

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await authApi.getProfile();
        const userData = response.data;
        setUser(userData);
        return userData;
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          logout();
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // ==================== LOGOUT ====================

  const logout = () => {
    storeLogout();
    queryClient.clear();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  // ==================== ROLE CHECKS ====================

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isManager = user?.role === "MANAGER" || user?.role === "SUPER_ADMIN";
  const isMember = user?.role === "MEMBER";

  // ==================== REFRESH ====================

  const refreshProfile = () => {
    return queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  // ==================== RETURN ====================

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading:
      authLoading || profile.isLoading || login.isPending || register.isPending,
    login,
    register,
    logout,
    refreshProfile,
    profile,
    hasRole,
    isSuperAdmin,
    isManager,
    isMember,
    setUser,
  };
};
