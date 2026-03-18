import apiClient from './api';

// Get all users
export const getAllUsers = (page = 1, limit = 10, role = '') => {
  return apiClient.get('/users', { params: { page, limit, role } });
};

// Create user (admin)
export const createUser = (userData) => {
  return apiClient.post('/users', userData);
};

// Get user by ID
export const getUserById = (id) => {
  return apiClient.get(`/users/${id}`);
};

// Get staff list
export const getStaffUsers = () => {
  return apiClient.get('/users/staff');
};

// Update user
export const updateUser = (id, userData) => {
  return apiClient.put(`/users/${id}`, userData);
};

// Delete user
export const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}`);
};

// Toggle user status
export const toggleUserStatus = (id, isActive) => {
  return apiClient.patch(`/users/${id}/status`, { is_active: isActive });
};

// Update own profile
export const updateProfile = (profileData) => {
  return apiClient.put('/users/profile', profileData);
};
