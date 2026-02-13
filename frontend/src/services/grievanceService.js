import apiClient from './api';

// Create grievance
export const createGrievance = (grievanceData) => {
  return apiClient.post('/grievances', grievanceData);
};

// Get all grievances
export const getAllGrievances = (page = 1, limit = 10, filters = {}) => {
  return apiClient.get('/grievances', {
    params: { page, limit, ...filters }
  });
};

// Get user's grievances
export const getUserGrievances = (page = 1, limit = 10) => {
  return apiClient.get('/grievances/my-grievances', {
    params: { page, limit }
  });
};

// Get grievance by ID
export const getGrievanceById = (id) => {
  return apiClient.get(`/grievances/${id}`);
};

// Update grievance status
export const updateGrievanceStatus = (id, status) => {
  return apiClient.patch(`/grievances/${id}/status`, { status });
};

// Assign grievance to staff
export const assignGrievance = (id, staffId) => {
  return apiClient.patch(`/grievances/${id}/assign`, { assigned_to: staffId });
};

// Get grievance statistics
export const getStatistics = () => {
  return apiClient.get('/grievances/statistics');
};

// Get staff assigned grievances
export const getStaffGrievances = (page = 1, limit = 10) => {
  return apiClient.get('/grievances/staff/assigned', {
    params: { page, limit }
  });
};
