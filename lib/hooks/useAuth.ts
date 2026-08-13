/* eslint-disable @next/next/no-location-assign-relative-destination */
/* eslint-disable react-hooks/exhaustive-deps */
// lib/hooks/useAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore, User } from "../store/authStore";
import { authApi, LoginData, RegisterData } from "../api/auth";
import { useEffect, useState, useMemo } from "react";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading: authLoading,
    _hasHydrated,
    setAuth,
    setUser,
    logout: storeLogout,
    setLoading,
    hydrate,
    setHydrated,
  } = useAuthStore();

  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ Force hydrate immediately on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check localStorage directly
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      console.log("🔍 Direct localStorage check:");
      console.log("  - Token:", token ? "✅ Exists" : "❌ Missing");
      console.log("  - User:", userStr ? "✅ Exists" : "❌ Missing");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log("  - Parsed User:", user?.name);
          // Force set auth if store is empty
          if (!isAuthenticated) {
            console.log("🔄 Force setting auth from localStorage");
            setAuth(user, token);
          }
        } catch (error) {
          console.error("❌ Failed to parse user:", error);
        }
      }

      hydrate();
      const timer = setTimeout(() => {
        setHydrated();
        setIsHydrated(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ==================== PROFILE QUERY ====================
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await authApi.getProfile();
      return response.data;
    },
    enabled: !!accessToken && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  // ==================== LOGIN ====================
  const login = useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      console.log("✅ Login Success - User:", user?.name);

      const typedUser: User = {
        ...user,
        role: user.role as "ADMIN" | "MANAGER" | "MEMBER",
      };

      setAuth(typedUser, accessToken!);
      queryClient.setQueryData(["profile"], typedUser);
      toast.success("Welcome back! 👋");
      setLoading(false);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";
      toast.error(message);
      setLoading(false);
    },
  });

  // ==================== REGISTER ====================
  const register = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      const typedUser: User = {
        ...user,
        role: user.role as "ADMIN" | "MANAGER" | "MEMBER",
      };
      if (!accessToken) {
        toast.success(
          response.data.message ||
            "Registration submitted. Please wait for approval.",
        );
        setLoading(false);
        router.push("/login");
        return;
      }
      setAuth(typedUser, accessToken);
      queryClient.setQueryData(["profile"], typedUser);
      toast.success("Account created successfully! 🎉");
      setLoading(false);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      setLoading(false);
    },
  });

  // ==================== CHANGE PASSWORD ====================
  const changePassword = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully! 🔒");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
    },
  });

  // ==================== LOGOUT ====================
  const logout = () => {
    storeLogout();
    queryClient.clear();
    toast.success("Logged out successfully 👋");
    window.location.href = "/login";
  };

  // ==================== PROFILE REFRESH ====================
  const refreshProfile = async () => {
    try {
      const response = await authApi.getProfile();
      const userData = response.data;
      const typedUser: User = {
        ...userData,
        role: userData.role as "ADMIN" | "MANAGER" | "MEMBER",
      };
      setUser(typedUser);
      queryClient.setQueryData(["profile"], typedUser);
      toast.success("Profile updated!");
      return typedUser;
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
      }
      toast.error("Failed to refresh profile");
    }
  };

  // ==================== ROLE CHECKS ====================
  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";
  const isMember = user?.role === "MEMBER";

  // ✅ Loading state - force false after hydration
  const isLoading = !isHydrated || authLoading;

  // ✅ Memoize auth state to prevent unnecessary re-renders
  const authState = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      profile,
      refetchProfile,
      login,
      register,
      logout,
      refreshProfile,
      changePassword,
      hasRole,
      isAdmin,
      isManager,
      isMember,
      setUser,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      profile,
      refetchProfile,
      login,
      register,
      logout,
      refreshProfile,
      changePassword,
      hasRole,
      isAdmin,
      isManager,
      isMember,
      setUser,
    ],
  );

  // ✅ Debug log (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 useAuth state:", {
      user: user?.name || "null",
      isAuthenticated,
      isLoading,
      isHydrated,
      token: accessToken ? "exists" : "missing",
      _hasHydrated,
    });
  }

  return authState;
};
