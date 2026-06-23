import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aiApi } from '../api/ai.api'

export function useAIChat() {
  return useMutation({
    mutationFn: async ({ prompt, conversationId }) => {
      const res = await aiApi.chat({ prompt, conversationId })
      return res.data.data
    },
  })
}

export function useConversations() {
  return useQuery({
    queryKey: ['ai', 'conversations'],
    queryFn: async () => {
      const res = await aiApi.getConversations()
      return res.data.data ?? []
    }
  })
}

export function useConversation(id) {
  return useQuery({
    queryKey: ['ai', 'conversations', id],
    queryFn: async () => {
      const res = await aiApi.getConversation(id)
      return res.data.data
    },
    enabled: !!id,
  })
}

export function useChat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ prompt, conversationId }) => {
      const res = await aiApi.chat({ prompt, conversationId })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'conversations'] })
    },
  })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const res = await aiApi.deleteConversation(id)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'conversations'] })
    },
  })
}
