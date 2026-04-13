import axios, { type InternalAxiosRequestConfig } from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();

  // Only attach token to endpoints that require authentication.
  // Keep public GET endpoints cache-friendly (no Authorization header).
  const needsAuth =
    url.startsWith("/admin") ||
    url.startsWith("/assets") ||
    url.startsWith("/uploads") ||
    (url.startsWith("/projects") && method !== "get") ||
    (url.startsWith("/registrations") && method !== "post");

  if (token && needsAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});
