import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor - add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cc_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Complaints
export const complaintAPI = {
  getDashboard: () => API.get('/complaints/dashboard'),
  getMyComplaints: (params) => API.get('/complaints/my', { params }),
  getComplaint: (id) => API.get(`/complaints/${id}`),
  createComplaint: (data) => API.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateComplaint: (id, data) => API.put(`/complaints/${id}`, data),
  deleteComplaint: (id) => API.delete(`/complaints/${id}`),
  addComment: (id, text) => API.post(`/complaints/${id}/comment`, { text }),
};

// Admin
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getComplaints: (params) => API.get('/admin/complaints', { params }),
  updateStatus: (id, data) => API.put(`/admin/complaints/${id}/status`, data),
  deleteComplaint: (id) => API.delete(`/admin/complaints/${id}`),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getReports: (params) => API.get('/admin/reports', { params }),
};

// Categories
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// Announcements
export const announcementAPI = {
  getAll: () => API.get('/announcements'),
  create: (data) => API.post('/announcements', data),
  update: (id, data) => API.put(`/announcements/${id}`, data),
  delete: (id) => API.delete(`/announcements/${id}`),
};

// Notifications
export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/read-all'),
  delete: (id) => API.delete(`/notifications/${id}`),
};

// Feedback
export const feedbackAPI = {
  submit: (complaintId, data) => API.post(`/feedback/${complaintId}`, data),
  getAll: () => API.get('/feedback'),
};

export default API;
