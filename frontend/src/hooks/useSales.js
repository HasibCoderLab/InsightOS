import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { salesApi } from '../api/sales.api'

export function useSales(params = {}) {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: async () => {
      const res = await salesApi.getAll(params)
      return res.data.data
    },
  })
}

export function useSale(id) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: async () => {
      const res = await salesApi.getById(id)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const res = await salesApi.create(data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

