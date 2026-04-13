import { create } from 'zustand'
import { api } from '../api/index.js'

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
            const { data } = await api.get('/recaps', {
                params: { q: normalizedQuery }
            })

            const normalizedData = Array.isArray(data)
                ? data
                : Array.isArray(data?.rows)
                    ? data.rows
                    : Array.isArray(data?.data)
                        ? data.data
                        : []

            set((state) => ({
                recapsByQuery: {
                    ...state.recapsByQuery,
                    [normalizedQuery]: normalizedData
                },
                isLoading: false,
                error: Array.isArray(data) ? null : 'Unexpected recap response format.'
            }))
        } catch (err) {
            set({
                isLoading: false,
                error: err?.message || 'Failed to load recap sheets.'
            })
        }
    }
}))
