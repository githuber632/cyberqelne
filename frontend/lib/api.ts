import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Attempt refresh (simplified — use stored refresh token)
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/auth/login";
      } catch {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((r) => r.data),
  register: (data: { email: string; nickname: string; password: string; country?: string }) =>
    api.post("/auth/register", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  logout: (refreshToken: string) => api.post("/auth/logout", { refreshToken }),
};

export const tournamentsApi = {
  list: (params?: Record<string, any>) =>
    api.get("/tournaments", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get(`/tournaments/${id}`).then((r) => r.data),
  register: (tournamentId: string, teamId: string) =>
    api.post(`/tournaments/${tournamentId}/register`, { teamId }).then((r) => r.data),
};

export const teamsApi = {
  list: (params?: Record<string, any>) =>
    api.get("/teams", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get(`/teams/${id}`).then((r) => r.data),
  create: (data: any) =>
    api.post("/teams", data).then((r) => r.data),
  invite: (teamId: string, userId: string) =>
    api.post(`/teams/${teamId}/invite`, { userId }).then((r) => r.data),
};

export const rankingsApi = {
  players: (params?: Record<string, any>) =>
    api.get("/rankings/players", { params }).then((r) => r.data),
  teams: (params?: Record<string, any>) =>
    api.get("/rankings/teams", { params }).then((r) => r.data),
};

export const shopApi = {
  products: (params?: Record<string, any>) =>
    api.get("/shop/products", { params }).then((r) => r.data),
  getProduct: (id: string) =>
    api.get(`/shop/products/${id}`).then((r) => r.data),
  createOrder: (data: any) =>
    api.post("/shop/orders", data).then((r) => r.data),
  getOrders: () =>
    api.get("/shop/orders/my").then((r) => r.data),
};

export const communityApi = {
  posts: (params?: Record<string, any>) =>
    api.get("/community/posts", { params }).then((r) => r.data),
  createPost: (data: any) =>
    api.post("/community/posts", data).then((r) => r.data),
  likePost: (postId: string) =>
    api.post(`/community/posts/${postId}/like`).then((r) => r.data),
  addComment: (postId: string, content: string) =>
    api.post(`/community/posts/${postId}/comments`, { content }).then((r) => r.data),
};
