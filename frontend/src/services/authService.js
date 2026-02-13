import apiClient from './api';

// Register
export const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};

// Login
export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

// Forgot Password
export const forgotPassword = (email) => {
  return apiClient.post('/auth/forgot-password', { email });
};

// Reset Password
export const resetPassword = (token, newPassword) => {
  return apiClient.post('/auth/reset-password', { token, newPassword });
};

// Get Current User Profile
export const getCurrentUser = () => {
  return apiClient.get('/auth/profile');
};
