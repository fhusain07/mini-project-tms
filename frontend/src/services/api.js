import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const generateToken    = (customerName) => api.post('/token/generate', { customerName });
export const getAllTokens      = (filters = {}) => api.get('/token/all', { params: filters });
export const getCurrentToken   = ()             => api.get('/token/current');
export const getStats          = ()             => api.get('/token/stats');
export const callNextToken     = ()             => api.post('/token/next');
export const completeToken     = (id)           => api.put(`/token/complete/${id}`);
export const resetQueue        = ()             => api.delete('/token/reset');
export const adminLogin        = (username, password) => api.post('/admin/login', { username, password });
