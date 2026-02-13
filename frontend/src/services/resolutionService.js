import apiClient from './api';

// Add resolution
export const addResolution = (resolutionData) => {
  return apiClient.post('/resolutions', resolutionData);
};

// Get grievance resolutions
export const getGrievanceResolutions = (grievanceId) => {
  return apiClient.get(`/resolutions/grievance/${grievanceId}`);
};

// Update resolution
export const updateResolution = (id, resolutionData) => {
  return apiClient.put(`/resolutions/${id}`, resolutionData);
};

// Delete resolution
export const deleteResolution = (id) => {
  return apiClient.delete(`/resolutions/${id}`);
};

// Get staff resolution history
export const getStaffResolutionHistory = (page = 1, limit = 10) => {
  return apiClient.get('/resolutions/staff/history', {
    params: { page, limit }
  });
};
