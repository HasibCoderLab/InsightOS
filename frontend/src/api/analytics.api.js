import api from './axios.config'

export const analyticsApi = {
  getSalesAnalytics: (params) => api.get('/sales/analytics', { params }),
  getExpenseSummary: (params) => api.get('/expenses/summary', { params }),
}
