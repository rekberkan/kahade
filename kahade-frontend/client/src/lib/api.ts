/*
 * KAHADE API SERVICE
 * Centralized API client for backend communication
 */

import axios from 'axios';

// Base API URL - will be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kahade_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kahade_token');
      localStorage.removeItem('kahade_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: { email: string; password: string; username: string }) =>
    api.post('/auth/register', data),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
  
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
  
  me: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

// User API
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  
  updateProfile: (data: { username?: string; phone?: string }) =>
    api.patch('/user/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/user/change-password', data),
  
  uploadKYC: (data: FormData) =>
    api.post('/user/kyc', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Transaction API
export const transactionApi = {
  list: (params?: { status?: string; role?: string; page?: number; limit?: number }) =>
    api.get('/transactions', { params }),
  
  get: (id: string) => api.get(`/transactions/${id}`),
  
  create: (data: {
    counterpartyEmail: string;
    role: 'buyer' | 'seller';
    title: string;
    description: string;
    category: string;
    amount: number;
    feePaidBy: 'buyer' | 'seller' | 'split';
    terms?: string;
  }) => api.post('/transactions', data),
  
  accept: (id: string) => api.post(`/transactions/${id}/accept`),
  
  reject: (id: string, reason?: string) =>
    api.post(`/transactions/${id}/reject`, { reason }),
  
  pay: (id: string) => api.post(`/transactions/${id}/pay`),
  
  confirmDelivery: (id: string) =>
    api.post(`/transactions/${id}/confirm-delivery`),
  
  confirmReceipt: (id: string) =>
    api.post(`/transactions/${id}/confirm-receipt`),
  
  dispute: (id: string, data: { reason: string; description: string }) =>
    api.post(`/transactions/${id}/dispute`, data),
  
  cancel: (id: string, reason?: string) =>
    api.post(`/transactions/${id}/cancel`, { reason }),
};

// Wallet API
export const walletApi = {
  getBalance: () => api.get('/wallet/balance'),
  
  getTransactions: (params?: { type?: string; page?: number; limit?: number }) =>
    api.get('/wallet/transactions', { params }),
  
  topUp: (data: { amount: number; method: string }) =>
    api.post('/wallet/topup', data),
  
  withdraw: (data: { amount: number; bankCode: string; accountNumber: string; accountName: string }) =>
    api.post('/wallet/withdraw', data),
  
  getBanks: () => api.get('/wallet/banks'),
};

// Notification API
export const notificationApi = {
  list: (params?: { read?: boolean; page?: number; limit?: number }) =>
    api.get('/notifications', { params }),
  
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  
  markAllRead: () => api.patch('/notifications/read-all'),
  
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Rating API
export const ratingApi = {
  create: (transactionId: string, data: { score: number; comment?: string }) =>
    api.post(`/transactions/${transactionId}/rating`, data),
  
  getUserRatings: (userId: string) => api.get(`/users/${userId}/ratings`),
};

// Admin API
export const adminApi = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Users
  getUsers: (params?: { status?: string; kycStatus?: string; page?: number; limit?: number }) =>
    api.get('/admin/users', { params }),
  
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  
  suspendUser: (id: string, reason: string) =>
    api.post(`/admin/users/${id}/suspend`, { reason }),
  
  activateUser: (id: string) => api.post(`/admin/users/${id}/activate`),
  
  approveKYC: (id: string) => api.post(`/admin/users/${id}/kyc/approve`),
  
  rejectKYC: (id: string, reason: string) =>
    api.post(`/admin/users/${id}/kyc/reject`, { reason }),
  
  // Transactions
  getTransactions: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/admin/transactions', { params }),
  
  getTransaction: (id: string) => api.get(`/admin/transactions/${id}`),
  
  forceCompleteTransaction: (id: string, reason: string) =>
    api.post(`/admin/transactions/${id}/force-complete`, { reason }),
  
  forceCancelTransaction: (id: string, reason: string) =>
    api.post(`/admin/transactions/${id}/force-cancel`, { reason }),
  
  // Disputes
  getDisputes: (params?: { status?: string; priority?: string; page?: number; limit?: number }) =>
    api.get('/admin/disputes', { params }),
  
  getDispute: (id: string) => api.get(`/admin/disputes/${id}`),
  
  startReview: (id: string) => api.post(`/admin/disputes/${id}/review`),
  
  resolveDispute: (id: string, data: { winner: 'buyer' | 'seller' | 'split'; resolution: string }) =>
    api.post(`/admin/disputes/${id}/resolve`, data),
  
  // Audit Logs
  getAuditLogs: (params?: { action?: string; actorType?: string; page?: number; limit?: number }) =>
    api.get('/admin/audit-logs', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  
  updateSettings: (data: Record<string, any>) =>
    api.patch('/admin/settings', data),
  
  // Withdrawals
  getPendingWithdrawals: () => api.get('/admin/withdrawals/pending'),
  
  approveWithdrawal: (id: string) =>
    api.post(`/admin/withdrawals/${id}/approve`),
  
  rejectWithdrawal: (id: string, reason: string) =>
    api.post(`/admin/withdrawals/${id}/reject`, { reason }),
};

export default api;
