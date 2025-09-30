// JWT Token management utilities
export const TOKEN_KEY = 'logistics_jwt_token';
export const USER_KEY = 'logistics_user_data';

// Normalize role from backend to frontend format
export const normalizeRole = role => {
  if (!role) return role;
  return role.toLowerCase();
};

// Store JWT token in localStorage
export const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove JWT token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Store user data in localStorage
export const setUser = user => {
  // Normalize role before storing
  const normalizedUser = user
    ? {
        ...user,
        role: normalizeRole(user.role),
      }
    : user;
  localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
};

// Get user data from localStorage
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Remove user data from localStorage
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Clear all authentication data
export const clearAuth = () => {
  removeToken();
  removeUser();
};

// Decode JWT token (basic implementation)
export const decodeToken = token => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = token => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
