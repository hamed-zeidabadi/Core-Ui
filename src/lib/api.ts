import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.VITE_API_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem("auth-token");
  },

  setToken: (token: string): void => {
    localStorage.setItem("auth-token", token);
  },

  removeToken: (): void => {
    localStorage.removeItem("auth-token");
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  getUserFromToken: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenManager.removeToken();
      localStorage.removeItem("auth-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
