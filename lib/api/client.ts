// lib/api/client.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Add token
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const messId = localStorage.getItem("currentMessId");
      if (messId) config.headers["X-Mess-Id"] = messId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // A number of mess-scoped endpoints return 401 when the user does not
      // yet have a selected mess. That is not proof that the JWT is invalid,
      // so never delete a valid session from this global interceptor.
      console.warn("Unauthorized API request", error.config?.url);
    }
    return Promise.reject(error);
  },
);
