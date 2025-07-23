import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isAdminRoute = originalRequest.url.includes('/admin');

    if (error.response?.status === 401 && isAdminRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const login = (credentials) => API.post('/login', credentials);

// ========== GENERIC CRUD ==========
export const fetchItems = (entity, query = {}) => API.get(`/${entity}`, { params: query });
export const fetchItem = (entity, id) => API.get(`/${entity}/${id}`);
export const createItem = (entity, data) => API.post(`/${entity}`, data);
export const updateItem = (entity, id, data) => API.put(`/${entity}/${id}`, data);
export const deleteItem = (entity, id) => API.delete(`/${entity}/${id}`);

// ========== FILE UPLOAD ==========
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


// ========== CONTACT FORM ==========
export const sendContactMessage = (message) => API.post('/contact', message);
 
// ========== PUBLIC ROUTES ==========
export const fetchPublicProjects = () => API.get('/public/projects');
export const fetchPublicSkills = () => API.get('/public/skills');
export const fetchPublicBlog = () => API.get('/public/blog');
export const fetchPublicPortfolio = () => API.get('/public/portfolio');
export const fetchSettings = () => API.get('/settings');

export default API;