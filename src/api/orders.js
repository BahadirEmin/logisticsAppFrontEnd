import api from './axios';

// Orders API functions
export const ordersAPI = {
  // Create new order
  create: async orderData => {
    try {
      const response = await api.post('/v1/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all orders
  getAll: async () => {
    try {
      const response = await api.get('/v1/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  getById: async id => {
    try {
      const response = await api.get(`/v1/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order
  update: async (id, orderData) => {
    try {
      const response = await api.put(`/v1/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete order
  delete: async id => {
    try {
      const response = await api.delete(`/v1/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign order to operation person
  assignToOperation: async (orderId, operationPersonId) => {
    try {
      if (!orderId || !operationPersonId) {
        throw new Error('Order ID and Operation Person ID are required');
      }

      const response = await api.post(
        `/v1/orders/${orderId}/assign-operation?operationPersonId=${operationPersonId}`
      );
      return response.data;
    } catch (error) {
      console.error('Assign to operation error:', error);
      throw error;
    }
  },

  // Assign order to fleet person
  assignToFleet: async (orderId, fleetPersonId) => {
    try {
      if (!orderId || !fleetPersonId) {
        throw new Error('Order ID and Fleet Person ID are required');
      }

      const response = await api.post(
        `/v1/orders/${orderId}/assign-fleet?fleetPersonId=${fleetPersonId}`,
        {}, // Empty body since backend expects query parameter
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Assign to fleet error:', error);
      throw error;
    }
  },

  // Get orders by sales person ID
  getBySalesPersonId: async salesPersonId => {
    try {
      const response = await api.get(`/v1/orders/sales-person/${salesPersonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by fleet person ID using search endpoint
  getByFleetPersonId: async fleetPersonId => {
    try {
      const response = await api.get(`/v1/orders/search?fleetPersonId=${fleetPersonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by operation person ID using search endpoint
  getByOperationPersonId: async operationPersonId => {
    try {
      const response = await api.get(`/v1/orders/search?operationPersonId=${operationPersonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by trip status
  getByTripStatus: async tripStatus => {
    try {
      const response = await api.get(`/v1/orders/status/${tripStatus}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search orders with multiple filters
  searchOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.salesPersonId) params.append('salesPersonId', filters.salesPersonId);
      if (filters.fleetPersonId) params.append('fleetPersonId', filters.fleetPersonId);
      if (filters.operationPersonId) params.append('operationPersonId', filters.operationPersonId);
      if (filters.tripStatus) params.append('tripStatus', filters.tripStatus);

      const response = await api.get(`/v1/orders/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by customer ID using search endpoint
  getByCustomerId: async customerId => {
    try {
      const response = await api.get(`/v1/orders/search?customerId=${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by trip status using search endpoint
  getByTripStatusSearch: async tripStatus => {
    try {
      const response = await api.get(`/v1/orders/search?tripStatus=${tripStatus}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign fleet resources (vehicle, driver, trailer) to order
  assignFleetResources: async (orderId, resources, assignedByUserId) => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      if (!assignedByUserId) {
        throw new Error('Assigned by user ID is required');
      }

      console.log('🚀 Assignment Request:', { orderId, resources, assignedByUserId });
      
      // Try individual assignments using the correct endpoints from documentation
      const assignments = [];
      const assignmentResults = [];
      
      if (resources.vehicleId) {
        try {
          // Use correct endpoint: /assign-vehicle with query parameters
          const vehicleResponse = await api.post(`/v1/orders/${orderId}/assign-vehicle?vehicleId=${resources.vehicleId}&assignedByUserId=${assignedByUserId}`);
          console.log('✅ Vehicle assignment success:', vehicleResponse.data);
          assignments.push('vehicle');
          assignmentResults.push({ type: 'vehicle', success: true, data: vehicleResponse.data });
        } catch (e) {
          console.error('❌ Vehicle assignment failed:', e.response?.data || e.message);
          assignmentResults.push({ type: 'vehicle', success: false, error: e.response?.data || e.message });
        }
      }
      
      if (resources.driverId) {
        try {
          // Use correct endpoint: /assign-driver with query parameters
          const driverResponse = await api.post(`/v1/orders/${orderId}/assign-driver?driverId=${resources.driverId}&assignedByUserId=${assignedByUserId}`);
          console.log('✅ Driver assignment success:', driverResponse.data);
          assignments.push('driver');
          assignmentResults.push({ type: 'driver', success: true, data: driverResponse.data });
        } catch (e) {
          console.error('❌ Driver assignment failed:', e.response?.data || e.message);
          assignmentResults.push({ type: 'driver', success: false, error: e.response?.data || e.message });
        }
      }
      
      if (resources.trailerId) {
        try {
          // Use correct endpoint: /assign-trailer with query parameters
          const trailerResponse = await api.post(`/v1/orders/${orderId}/assign-trailer?trailerId=${resources.trailerId}&assignedByUserId=${assignedByUserId}`);
          console.log('✅ Trailer assignment success:', trailerResponse.data);
          assignments.push('trailer');
          assignmentResults.push({ type: 'trailer', success: true, data: trailerResponse.data });
        } catch (e) {
          console.error('❌ Trailer assignment failed:', e.response?.data || e.message);
          assignmentResults.push({ type: 'trailer', success: false, error: e.response?.data || e.message });
        }
      }
      
      if (assignments.length > 0) {
        const successMessage = `Successfully assigned: ${assignments.join(', ')}`;
        // Return the last successful response data (should contain updated order)
        const lastSuccessful = assignmentResults.filter(r => r.success).pop();
        console.log('🎉 Final assignment result:', lastSuccessful?.data);
        return lastSuccessful ? lastSuccessful.data : { message: successMessage };
      } else {
        throw new Error('All assignments failed');
      }
    } catch (error) {
      console.error('💥 Assign fleet resources error:', error);
      throw error;
    }
  },

  // Get all orders for fleet management
  getOrdersForFleet: async () => {
    try {
      // Fleet endpoint has backend bug - use regular orders endpoint instead
      const timestamp = new Date().getTime();
      const response = await api.get(`/v1/orders?_t=${timestamp}`);
      return { data: response.data || [] };
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  // Download driver information document
  downloadDriverInformationDocument: async orderId => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await api.get(`/v1/orders/${orderId}/driver-information-document`, {
        responseType: 'blob', // Important for downloading binary files
        headers: {
          accept: 'application/octet-stream',
        },
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `driver_info_${orderId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      console.error('Download driver information document error:', error);
      throw error;
    }
  },

  // Get assignment history for an order
  getAssignmentHistory: async orderId => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await api.get(`/v1/orders/${orderId}/assignment-history`);
      return response.data;
    } catch (error) {
      console.error('Get assignment history error:', error);
      throw error;
    }
  },
};
