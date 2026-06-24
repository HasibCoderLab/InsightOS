import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setAuth, logout, initializeAuth, setLoading } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const { data: me, isLoading: meLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await authApi.getMe()
      return res.data.data.user
    },
    enabled: !!token && !user,
    retry: false,
  })

  useEffect(() => {
    if (me) {
      setAuth(me, token)
      setLoading(false)
    } else if (meLoading === false && token && !user) {
      setLoading(false)
    }
  }, [me, meLoading, token, user, setAuth, setLoading])

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data
      setAuth(user, accessToken)
      refetch()
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data
      setAuth(user, accessToken)
      refetch()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
    },
    onError: () => {
      logout()
    },
  })

  const login = async (credentials) => {
    setLoading(true)
    return loginMutation.mutateAsync(credentials)
  }

  const register = async (data) => {
    setLoading(true)
    return registerMutation.mutateAsync(data)
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || meLoading,
    login,
    register,
    logout: handleLogout,
    loginMutation,
    registerMutation,
  }
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe()
      return res.data.data.user
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      const updatedUser = response.data.data.user
      setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: authApi.uploadAvatar,
    onSuccess: (response) => {
      const updatedUser = response.data.data.user
      setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: authApi.deleteAvatar,
    onSuccess: (response) => {
      const updatedUser = response.data.data.user
      setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}