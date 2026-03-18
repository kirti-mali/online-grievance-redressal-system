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

// Get grievance comments
export const getComments = (grievanceId) => {
  return apiClient.get(`/comments/grievance/${grievanceId}`);
};

// Add comment to grievance
export const addComment = (grievanceId, commentData) => {
  return apiClient.post(`/comments/grievance/${grievanceId}`, commentData);
};

// Upload document
export const uploadDocument = (grievanceId, formData) => {
  return apiClient.post(`/documents/${grievanceId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Download document
export const downloadDocument = (documentId) => {
  return apiClient.get(`/documents/${documentId}/download`, {
    responseType: 'blob'
  });
};

// Get grievance documents
export const getDocuments = (grievanceId) => {
  return apiClient.get(`/documents/${grievanceId}/list`);
};

// Delete document
export const deleteDocument = (documentId) => {
  return apiClient.delete(`/documents/${documentId}`);
};

// Get grievance status history
export const getStatusHistory = (grievanceId) => {
  return apiClient.get(`/status-history/grievance/${grievanceId}`);
};

// Get all staff members
export const getStaffMembers = () => {
  return apiClient.get('/users/staff');
};

// Get categories
export const getCategories = () => {
  return apiClient.get('/categories');
};
