import { create } from 'zustand'
import { api } from '../api/index.js'


// Module-level cache for recap resources
const recapResourceCache = new Map();
export const useRecapStore = create((set, get) => ({
    recapsByQuery: {},
    lastQuery: '',
    isLoading: false,
    error: null,
    // Resource-style recap fetcher with cache (for use() hook)
    getRecapResource(rid) {
        if (!recapResourceCache.has(rid)) {
            const recapPromise = api.get(`/recaps/${rid}`)
                .then(({ data }) => ({
                    recap: {
                        ...(data ?? {}),
                        clo: Array.isArray(data?.clo) ? data.clo : []
                    },
                    error: null
                }))
                .catch((err) => ({
                    recap: null,
                    error: err?.response?.data?.error || 'Failed to load recap data.'
                }))
            recapResourceCache.set(rid, recapPromise)
        }
        return recapResourceCache.get(rid)
    },
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
    },
    updateRecapClosid: (rid, closid) => {
        set((state) => {
            const updated = {}
            for (const [query, list] of Object.entries(state.recapsByQuery)) {
                updated[query] = list.map(r => r.rid === rid ? { ...r, closid } : r)
            }
            return { recapsByQuery: updated }
        })
    }
}))
