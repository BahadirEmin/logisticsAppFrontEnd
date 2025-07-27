import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/auth";
import {
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  removeUser,
  isAuthenticated,
  clearAuth,
  normalizeRole,
} from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        const savedUser = getUser();

        if (token && savedUser) {
          setUserState(savedUser);

          // Optionally verify token with backend
          try {
            const profile = await authAPI.getProfile();
            const normalizedProfile = {
              ...profile,
              role: normalizeRole(profile.role),
            };
            setUserState(normalizedProfile);
            setUser(normalizedProfile);
          } catch (error) {
            // If profile fetch fails, clear auth
            clearAuth();
            setUserState(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(username, password);

      // Normalize user data before storing
      const normalizedUser = response.user
        ? {
            ...response.user,
            role: normalizeRole(response.user.role),
          }
        : { username, role: "sales" };

      // Store token and user data
      setToken(response.token);
      setUser(normalizedUser);
      setUserState(normalizedUser);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Giriş başarısız");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      clearAuth();
      setUserState(null);
      setError(null);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    const normalizedUser = userData
      ? {
          ...userData,
          role: normalizeRole(userData.role),
        }
      : userData;
    setUserState(normalizedUser);
    setUser(normalizedUser);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
