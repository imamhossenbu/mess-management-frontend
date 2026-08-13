// lib/api/client.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

// Request Interceptor - Token যোগ করুন
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // ✅ Token নিন localStorage থেকে
      const token = localStorage.getItem("accessToken");
      console.log(
        "🔑 Token from localStorage:",
        token ? "Exists" : "Not found",
      );

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No token found in localStorage");
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - 401 handle করুন
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      console.warn("🔴 401 Unauthorized:", error.config?.url);

      // Login page এ না থাকলে redirect করুন
      if (!path.includes("/login") && !path.includes("/auth/callback")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
