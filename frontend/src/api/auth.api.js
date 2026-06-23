import api from './axios.config'

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
  uploadAvatar: (formData) => api.post('/auth/me/avatar', formData),
  deleteAvatar: () => api.delete('/auth/me/avatar'),
  logout: () => api.post('/auth/logout'),
}