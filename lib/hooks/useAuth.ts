// /* eslint-disable @next/next/no-location-assign-relative-destination */
// /* eslint-disable react-hooks/exhaustive-deps */
// // lib/hooks/useAuth.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { useAuthStore, User } from "../store/authStore";
// import { authApi, LoginData, RegisterData } from "../api/auth";
// import { useEffect, useState, useMemo } from "react";

// export const useAuth = () => {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const {
//     user,
//     accessToken,
//     isAuthenticated,
//     isLoading: authLoading,
//     _hasHydrated,
//     setAuth,
//     setUser,
//     logout: storeLogout,
//     setLoading,
//     hydrate,
//     setHydrated,
//   } = useAuthStore();

//   const [isHydrated, setIsHydrated] = useState(false);

//   // ✅ Force hydrate immediately on mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // Check localStorage directly
//       const token = localStorage.getItem("accessToken");
//       const userStr = localStorage.getItem("user");

//       console.log("🔍 Direct localStorage check:");
//       console.log("  - Token:", token ? "✅ Exists" : "❌ Missing");
//       console.log("  - User:", userStr ? "✅ Exists" : "❌ Missing");

//       if (token && userStr) {
//         try {
//           const user = JSON.parse(userStr);
//           console.log("  - Parsed User:", user?.name);
//           // Force set auth if store is empty
//           if (!isAuthenticated) {
//             console.log("🔄 Force setting auth from localStorage");
//             setAuth(user, token);
//           }
//         } catch (error) {
//           console.error("❌ Failed to parse user:", error);
//         }
//       }

//       hydrate();
//       const timer = setTimeout(() => {
//         setHydrated();
//         setIsHydrated(true);
//       }, 50);
//       return () => clearTimeout(timer);
//     }
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // ==================== PROFILE QUERY ====================
//   const { data: profile, refetch: refetchProfile } = useQuery({
//     queryKey: ["profile"],
//     queryFn: async () => {
//       const response = await authApi.getProfile();
//       return response.data;
//     },
//     enabled: !!accessToken && isAuthenticated,
//     staleTime: 5 * 60 * 1000,
//   });

//   // ==================== LOGIN ====================
//   const login = useMutation({
//     mutationFn: (data: LoginData) => authApi.login(data),
//     onSuccess: (response) => {
//       const { accessToken, user } = response.data;
//       console.log("✅ Login Success - User:", user?.name);

//       const typedUser: User = {
//         ...user,
//         role: user.role as "ADMIN" | "MANAGER" | "MEMBER",
//       };

//       setAuth(typedUser, accessToken!);
//       queryClient.setQueryData(["profile"], typedUser);
//       toast.success("Welcome back! 👋");
//       setLoading(false);
//       router.push("/dashboard");
//     },
//     onError: (error: any) => {
//       const message =
//         error.response?.data?.message ||
//         "Invalid email or password. Please try again.";
//       toast.error(message);
//       setLoading(false);
//     },
//   });

//   // ==================== REGISTER ====================
//   const register = useMutation({
//     mutationFn: (data: RegisterData) => authApi.register(data),
//     onSuccess: (response) => {
//       const { accessToken, user } = response.data;
//       const typedUser: User = {
//         ...user,
//         role: user.role as "ADMIN" | "MANAGER" | "MEMBER",
//       };
//       if (!accessToken) {
//         toast.success(
//           response.data.message ||
//             "Registration submitted. Please wait for approval.",
//         );
//         setLoading(false);
//         router.push("/login");
//         return;
//       }
//       setAuth(typedUser, accessToken);
//       queryClient.setQueryData(["profile"], typedUser);
//       toast.success("Account created successfully! 🎉");
//       setLoading(false);
//       router.push("/dashboard");
//     },
//     onError: (error: any) => {
//       const message =
//         error.response?.data?.message ||
//         "Registration failed. Please try again.";
//       toast.error(message);
//       setLoading(false);
//     },
//   });

//   // ==================== CHANGE PASSWORD ====================
//   const changePassword = useMutation({
//     mutationFn: (data: { currentPassword: string; newPassword: string }) =>
//       authApi.changePassword(data),
//     onSuccess: () => {
//       toast.success("Password changed successfully! 🔒");
//     },
//     onError: (error: any) => {
//       const message =
//         error.response?.data?.message || "Failed to change password";
//       toast.error(message);
//     },
//   });

//   // ==================== LOGOUT ====================
//   const logout = () => {
//     storeLogout();
//     queryClient.clear();
//     toast.success("Logged out successfully 👋");
//     window.location.href = "/login";
//   };

//   // ==================== PROFILE REFRESH ====================
//   const refreshProfile = async () => {
//     try {
//       const response = await authApi.getProfile();
//       const userData = response.data;
//       const typedUser: User = {
//         ...userData,
//         role: userData.role as "ADMIN" | "MANAGER" | "MEMBER",
//       };
//       setUser(typedUser);
//       queryClient.setQueryData(["profile"], typedUser);
//       toast.success("Profile updated!");
//       return typedUser;
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         logout();
//       }
//       toast.error("Failed to refresh profile");
//     }
//   };

//   // ==================== ROLE CHECKS ====================
//   const hasRole = (roles: string | string[]) => {
//     if (!user) return false;
//     const roleArray = Array.isArray(roles) ? roles : [roles];
//     return roleArray.includes(user.role);
//   };

//   const isAdmin = user?.role === "ADMIN";
//   const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";
//   const isMember = user?.role === "MEMBER";

//   // ✅ Loading state - force false after hydration
//   const isLoading = !isHydrated || authLoading;

//   // ✅ Memoize auth state to prevent unnecessary re-renders
//   const authState = useMemo(
//     () => ({
//       user,
//       accessToken,
//       isAuthenticated,
//       isLoading,
//       profile,
//       refetchProfile,
//       login,
//       register,
//       logout,
//       refreshProfile,
//       changePassword,
//       hasRole,
//       isAdmin,
//       isManager,
//       isMember,
//       setUser,
//     }),
//     [
//       user,
//       accessToken,
//       isAuthenticated,
//       isLoading,
//       profile,
//       refetchProfile,
//       login,
//       register,
//       logout,
//       refreshProfile,
//       changePassword,
//       hasRole,
//       isAdmin,
//       isManager,
//       isMember,
//       setUser,
//     ],
//   );

//   // ✅ Debug log (only in development)
//   if (process.env.NODE_ENV === "development") {
//     console.log("🔍 useAuth state:", {
//       user: user?.name || "null",
//       isAuthenticated,
//       isLoading,
//       isHydrated,
//       token: accessToken ? "exists" : "missing",
//       _hasHydrated,
//     });
//   }

//   return authState;
// };

/* eslint-disable @next/next/no-location-assign-relative-destination */
/* eslint-disable react-hooks/exhaustive-deps */
// lib/hooks/useAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-location-assign-relative-destination */
/* eslint-disable react-hooks/exhaustive-deps */
// lib/hooks/useAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @next/next/no-location-assign-relative-destination */
/* eslint-disable react-hooks/exhaustive-deps */
// lib/hooks/useAuth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore, User } from "../store/authStore";
import { authApi, LoginData, RegisterData } from "../api/auth";
import { useEffect, useState, useMemo, useRef } from "react";

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
  const logoutRef = useRef<(() => void) | null>(null);

  // ==================== LOGOUT FUNCTION (FIRST) ====================
  const handleLogout = () => {
    console.log("🔴 Logging out...");
    storeLogout();
    queryClient.clear();
    toast.success("Logged out successfully 👋");

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Save logout function to ref
  useEffect(() => {
    logoutRef.current = handleLogout;
  }, []);

  // ==================== CHECK USER STATUS ====================
  const checkUserStatus = async () => {
    try {
      const response = await authApi.getProfile();
      const userData = response.data;

      console.log("✅ User status check:", userData?.name);

      // ✅ Check if user is active
      if (userData.isActive === false) {
        console.log("❌ User is inactive - logging out");
        handleLogout();
        toast.error("Your account has been deactivated");
        return false;
      }

      // ✅ Check if user is approved
      if (userData.approvalStatus && userData.approvalStatus !== "APPROVED") {
        console.log("❌ User not approved - logging out");
        handleLogout();
        toast.error("Your account is not approved yet");
        return false;
      }

      return true;
    } catch (error: any) {
      console.log("❌ Status check failed:", error);
      // If 401/403, logout
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
        return false;
      }
      return true;
    }
  };

  // ==================== FORCE HYDRATE ====================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          if (!isAuthenticated) {
            setAuth(user, token);
          }
        } catch (error) {
          console.error("Failed to parse user:", error);
        }
      }

      hydrate();
      const timer = setTimeout(() => {
        setHydrated();
        setIsHydrated(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  // ==================== PROFILE QUERY ====================
  const {
    data: profile,
    refetch: refetchProfile,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await authApi.getProfile();
      const userData = response.data;

      console.log("👤 Profile fetched:", userData?.name);

      return userData;
    },
    enabled: !!accessToken && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // ==================== AUTO CHECK EVERY 30 SECONDS ====================
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    console.log("🔄 Starting auto status check...");

    // Initial check after 5 seconds
    const initialTimer = setTimeout(() => {
      checkUserStatus();
    }, 5000);

    // Check every 30 seconds
    const interval = setInterval(() => {
      checkUserStatus();
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isAuthenticated, accessToken]);

  // ==================== WINDOW FOCUS CHECK ====================
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const handleFocus = () => {
      console.log("🔄 Window focus - checking user status...");
      checkUserStatus();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, accessToken]);

  // ==================== HANDLE PROFILE ERROR ====================
  useEffect(() => {
    if (isProfileError && profileError) {
      const err = profileError as any;
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("🔴 Profile error - logging out");
        handleLogout();
      }
    }
  }, [isProfileError, profileError]);

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
    handleLogout();
  };

  // ==================== PROFILE REFRESH ====================
  const refreshProfile = async () => {
    try {
      const response = await authApi.getProfile();
      const userData = response.data;

      // Check if user is active
      if (userData.isActive === false) {
        handleLogout();
        toast.error("Your account has been deactivated");
        throw new Error("User account is inactive");
      }

      if (userData.approvalStatus && userData.approvalStatus !== "APPROVED") {
        handleLogout();
        toast.error("Your account is not approved yet");
        throw new Error("User account is not approved");
      }

      const typedUser: User = {
        ...userData,
        role: userData.role as "ADMIN" | "MANAGER" | "MEMBER",
      };
      setUser(typedUser);
      queryClient.setQueryData(["profile"], typedUser);
      toast.success("Profile updated!");
      return typedUser;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
      throw error;
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

  // ✅ Loading state
  const isLoading = !isHydrated || authLoading;

  // ✅ Memoize auth state
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
      checkUserStatus,
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
      checkUserStatus,
    ],
  );

  return authState;
};
