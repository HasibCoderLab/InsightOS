import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../api/analytics.api'

export function useDashboard(params = {}) {
  return useQuery({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: async () => {
      const [salesRes, expenseRes] = await Promise.all([
        analyticsApi.getSalesAnalytics(params),
        analyticsApi.getExpenseSummary(params),
      ])
      return {
        sales: salesRes.data.data,
        expense: expenseRes.data.data,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
