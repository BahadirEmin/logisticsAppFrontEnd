import api from './axios';

// Statistics API functions
export const statisticsAPI = {
  // Fleet Dashboard Statistics
  getFleetDashboardStats: async (fleetPersonId = null) => {
    try {
      const params = fleetPersonId ? { fleetPersonId } : {};
      const response = await api.get('/v1/statistics/fleet-dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('Fleet dashboard stats error:', error);
      throw error;
    }
  },

  // Sales Dashboard Statistics
  getSalesDashboardStats: async (salesPersonId = null) => {
    try {
      const params = salesPersonId ? { salesPersonId } : {};
      const response = await api.get('/v1/statistics/sales-dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('Sales dashboard stats error:', error);
      throw error;
    }
  },

  // Operator Dashboard Statistics
  getOperatorDashboardStats: async (operatorId = null) => {
    try {
      const params = operatorId ? { operatorId } : {};
      const response = await api.get('/v1/statistics/operator-dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('Operator dashboard stats error:', error);
      throw error;
    }
  },

  // Recent Activities
  getRecentActivities: async (options = {}) => {
    try {
      const { limit = 10, type = null, userId = null } = options;
      const params = { limit };
      if (type) params.type = type;
      if (userId) params.userId = userId;

      const response = await api.get('/v1/statistics/recent-activities', { params });
      return response.data;
    } catch (error) {
      console.error('Recent activities error:', error);
      throw error;
    }
  },

  // Dashboard Notifications
  getDashboardNotifications: async (userId = null, unreadOnly = false) => {
    try {
      const params = { unreadOnly };
      if (userId) params.userId = userId;

      const response = await api.get('/v1/statistics/notifications/dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('Dashboard notifications error:', error);
      throw error;
    }
  },

  // Trip Tracking Statistics
  getTripTrackingStats: async (options = {}) => {
    try {
      const { status = null, limit = 50, search = null } = options;
      const params = { limit };
      if (status) params.status = status;
      if (search) params.search = search;

      const response = await api.get('/v1/statistics/trip-tracking', { params });
      return response.data;
    } catch (error) {
      console.error('Trip tracking stats error:', error);
      throw error;
    }
  },

  // Real-time Trip Tracking
  getTripTrackingRealTime: async () => {
    try {
      const response = await api.get('/v1/statistics/trip-tracking/real-time');
      return response.data;
    } catch (error) {
      console.error('Trip tracking real-time error:', error);
      throw error;
    }
  },

  // Vehicle Utilization
  getVehicleUtilization: async () => {
    try {
      const response = await api.get('/v1/statistics/vehicles/utilization');
      return response.data;
    } catch (error) {
      console.error('Vehicle utilization error:', error);
      throw error;
    }
  },

  // Financial Summary
  getFinancialSummary: async (period = null, startDate = null, endDate = null) => {
    try {
      const params = {};
      if (period) params.period = period;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/v1/statistics/financial/summary', { params });
      return response.data;
    } catch (error) {
      console.error('Financial summary error:', error);
      throw error;
    }
  },

  // Offer Performance
  getOfferPerformance: async (salesPersonId = null, period = null) => {
    try {
      const params = {};
      if (salesPersonId) params.salesPersonId = salesPersonId;
      if (period) params.period = period;

      const response = await api.get('/v1/statistics/offers/performance', { params });
      return response.data;
    } catch (error) {
      console.error('Offer performance error:', error);
      throw error;
    }
  },

  // Recent Offers (Son Teklifler)
  getRecentOffers: async (salesPersonId = null, limit = 5) => {
    try {
      const params = { limit };
      if (salesPersonId) params.salesPersonId = salesPersonId;

      const response = await api.get('/v1/statistics/offers/recent', { params });
      return response.data;
    } catch (error) {
      console.error('Recent offers error:', error);
      throw error;
    }
  },

  // Operational Efficiency
  getOperationalEfficiency: async () => {
    try {
      const response = await api.get('/v1/statistics/operational-efficiency');
      return response.data;
    } catch (error) {
      console.error('Operational efficiency error:', error);
      throw error;
    }
  },

  // Customer Analysis
  getCustomerAnalysis: async () => {
    try {
      const response = await api.get('/v1/statistics/customers/analysis');
      return response.data;
    } catch (error) {
      console.error('Customer analysis error:', error);
      throw error;
    }
  },

  // Trend Analysis
  getTrendAnalysis: async (period = 'monthly', months = 6) => {
    try {
      const params = { period, months };
      const response = await api.get('/v1/statistics/trends', { params });
      return response.data;
    } catch (error) {
      console.error('Trend analysis error:', error);
      throw error;
    }
  },

  // Executive Summary
  getExecutiveSummary: async () => {
    try {
      const response = await api.get('/v1/statistics/reports/executive-summary');
      return response.data;
    } catch (error) {
      console.error('Executive summary error:', error);
      throw error;
    }
  },

  // System Health
  getSystemHealth: async () => {
    try {
      const response = await api.get('/v1/statistics/system-health');
      return response.data;
    } catch (error) {
      console.error('System health error:', error);
      throw error;
    }
  },
};

// Utility functions for frontend
export const statisticsUtils = {
  // Format growth percentage
  formatGrowth: growth => {
    const percentage = (growth * 100).toFixed(1);
    const isPositive = growth > 0;
    return {
      value: `${isPositive ? '+' : ''}${percentage}%`,
      color: isPositive ? 'success' : 'error',
      icon: isPositive ? '↗️' : '↘️',
    };
  },

  // Format currency
  formatCurrency: (amount, currency = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format large numbers
  formatLargeNumber: value => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  },

  // Get status color
  getStatusColor: status => {
    const colors = {
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info',
      active: 'success',
      inactive: 'error',
      maintenance: 'warning',
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  },

  // Get priority color
  getPriorityColor: priority => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    };
    return colors[priority] || 'default';
  },

  // Calculate utilization percentage
  calculateUtilization: (used, total) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  },

  // Format relative time
  formatRelativeTime: timestamp => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} dakika önce`;
    } else if (hours < 24) {
      return `${hours} saat önce`;
    } else {
      return `${days} gün önce`;
    }
  },
};

export default statisticsAPI;
