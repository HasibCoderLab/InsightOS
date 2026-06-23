import api from './axios.config'

export const userApi = {
  clearAllData: () => api.delete('/user/data'),
  deleteAccount: () => api.delete('/user/account'),
}
