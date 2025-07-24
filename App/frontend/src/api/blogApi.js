// src/api/blogApi.js
import axios from 'axios';

const API_BASE = '/api';

// Set up axios instance with auth token
const blogApi = axios.create({
  baseURL: API_BASE,
});

// Add request interceptor to include auth token
blogApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBlogPosts = async (params = {}) => {
  try {
    const response = await blogApi.get('/blog/posts', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blog posts');
  }
};

export const getBlogPost = async (id) => {
  try {
    const response = await blogApi.get(`/blog/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blog post');
  }
};

export const getBlogPostBySlug = async (slug) => {
  try {
    const response = await blogApi.get(`/blog/posts/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blog post');
  }
};

export const createBlogPost = async (postData) => {
  try {
    const response = await blogApi.post('/admin/blog/posts', postData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create blog post');
  }
};

export const updateBlogPost = async (id, postData) => {
  try {
    const response = await blogApi.put(`/admin/blog/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update blog post');
  }
};

export const deleteBlogPost = async (id) => {
  try {
    const response = await blogApi.delete(`/admin/blog/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete blog post');
  }
};

export const uploadBlogImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await blogApi.post('/admin/blog/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

export const getBlogCategories = async () => {
  try {
    const response = await blogApi.get('/blog/categories');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

export const likeBlogPost = async (id) => {
  try {
    const response = await blogApi.post(`/blog/posts/${id}/like`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to like post');
  }
};