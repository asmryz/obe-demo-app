import { createStore } from "zustand/vanilla";
import { useStore as useZustandStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "../api";

const createUseStore = (store) => (selector, equals) =>
    useZustandStore(store, selector, equals);

export const store = createStore()(
    persist(
        (set) => ({
            initialized: false,
            signedIn: false,
            recap:null,
            closheet:null,
            recaps: [],
            recapPgNo: { currentPage: 1, recapsPerPage: 10, selectedSemester: 'All', selectedYear: 'All', searchQuery: '' },
            
            signIn: () => set({ signedIn: true }),
            signOut: () => set({ signedIn: false }),
            setRecaps: (recaps) => set({ recaps }),
            setRecap: (recap) => set({ recap }),
            setClosheet: (closheet) => set({ closheet }),
            setRecapPgNo: (recapPgNoUpdate) => set((state) => ({ 
                recapPgNo: { ...(state.recapPgNo || { currentPage: 1, recapsPerPage: 10, selectedSemester: 'All', selectedYear: 'All', searchQuery: '' }), ...recapPgNoUpdate } 
            })),
            getRecaps: (query = "") => {
                return api.get(`/recaps?q=${encodeURIComponent(query)}`).then(res => {
                    set({ recaps: res.data });
                    return res.data;
                });
            },
            getCLOSheet: (closid) => {
                return api.get(`/closheet/${closid}`).then(res => {
                    set({ closheet: res.data });
                    return res.data;
                });
            }
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
            // We don't need partialize anymore because we aren't storing the promise in the state
        }
    )
);

export const useStore = createUseStore(store);
