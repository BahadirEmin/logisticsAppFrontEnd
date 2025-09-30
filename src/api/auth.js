import api from './axios';

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    });

    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      // Call logout endpoint if your backend has one
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails, we'll still clear local storage
      console.error('Logout error:', error);
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Refresh token (if your backend supports it)
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};
