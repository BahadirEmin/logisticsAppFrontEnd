import axios from "axios";
import { getToken, clearAuth, isTokenExpired } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // backend adresini güncelle
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Check if token is expired
    if (token && isTokenExpired(token)) {
      clearAuth();
      window.location.href = "/login";
      return Promise.reject(new Error("Token expired"));
    }

    // Add token to request headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      clearAuth();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
