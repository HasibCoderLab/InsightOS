import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../api/user.api'
import { useAuthStore } from '../store/authStore'

export function useClearAllData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.clearAllData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useDeleteAccount() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      logout()
      navigate('/login')
    },
  })
}
