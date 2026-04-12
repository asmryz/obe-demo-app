import { create } from 'zustand'
import { api } from '../../api'

export const useRecapStore = create((set, get) => ({
    recapsByQuery: {},
    lastQuery: '',
    isLoading: false,
    error: null,
    fetchRecaps: async (query = '') => {
        const normalizedQuery = query.trim().length >= 3 ? query.trim() : ''
        const hasCachedQuery = Object.prototype.hasOwnProperty.call(get().recapsByQuery, normalizedQuery)

        if (hasCachedQuery) {
            set({ lastQuery: normalizedQuery, error: null })
            return
        }

        set({ isLoading: true, error: null, lastQuery: normalizedQuery })

        try {
            const { data } = await api.get('/api/recaps', {
                params: { q: normalizedQuery }
            })

            set((state) => ({
                recapsByQuery: {
                    ...state.recapsByQuery,
                    [normalizedQuery]: data
                },
                isLoading: false,
                error: null
            }))
        } catch (err) {
            set({
                isLoading: false,
                error: err?.message || 'Failed to load recap sheets.'
            })
        }
    }
}))
