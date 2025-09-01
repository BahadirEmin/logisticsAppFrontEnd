import api from "./axios";

// Users API functions
export const usersAPI = {
  // Get user by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/v1/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all users
  getAll: async () => {
    try {
      const response = await api.get("/v1/users");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all users with pagination
  getAllPaginated: async (page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
    try {
      const response = await api.get(`/v1/users/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    try {
      const response = await api.post("/v1/users", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const response = await api.put(`/v1/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user (soft delete)
  delete: async (id) => {
    try {
      const response = await api.delete(`/v1/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search users
  search: async (department, role, isActive, name) => {
    try {
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (role) params.append('role', role);
      if (isActive !== undefined) params.append('isActive', isActive);
      if (name) params.append('name', name);
      
      const response = await api.get(`/v1/users/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get users by department
  getByDepartment: async (department) => {
    try {
      const response = await api.get(`/v1/users/department/${department}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get users by role
  getByRole: async (role) => {
    try {
      const response = await api.get(`/v1/users/role/${role}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active users
  getActive: async () => {
    try {
      const response = await api.get("/v1/users/active");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if username exists
  checkUsernameExists: async (username) => {
    try {
      const response = await api.get(`/v1/users/check-username?username=${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if email exists
  checkEmailExists: async (email) => {
    try {
      const response = await api.get(`/v1/users/check-email?email=${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate if user exists (alias for getById)
  validateUser: async (userId) => {
    try {
      const response = await api.get(`/v1/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
