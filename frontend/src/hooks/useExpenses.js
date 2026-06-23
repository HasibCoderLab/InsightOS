import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expenseApi } from '../api/expense.api'

export function useExpenses(params = {}) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const res = await expenseApi.getAll(params)
      return res.data.data
    },
  })
}

export function useExpense(id) {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: async () => {
      const res = await expenseApi.getById(id)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const res = await expenseApi.create(data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await expenseApi.update(id, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const res = await expenseApi.delete(id)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useExpenseSummary(params = {}) {
  return useQuery({
    queryKey: ['expenses', 'summary', params],
    queryFn: async () => {
      const res = await expenseApi.getSummary(params)
      return res.data.data
    },
  })
}
