import apiClient from './api';

// Get all categories
export const getAllCategories = () => {
  return apiClient.get('/categories');
};

// Get categories with count
export const getCategoriesWithCount = () => {
  return apiClient.get('/categories/with-count');
};

// Get category by ID
export const getCategoryById = (id) => {
  return apiClient.get(`/categories/${id}`);
};

// Create category
export const createCategory = (categoryData) => {
  return apiClient.post('/categories', categoryData);
};

// Update category
export const updateCategory = (id, categoryData) => {
  return apiClient.put(`/categories/${id}`, categoryData);
};

// Delete category
export const deleteCategory = (id) => {
  return apiClient.delete(`/categories/${id}`);
};
