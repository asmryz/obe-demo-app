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
            recaps: [],
            signIn: () => set({ signedIn: true }),
            signOut: () => set({ signedIn: false }),
            setRecaps: (recaps) => set({ recaps }),
            getRecaps: () => {
                return api.get("/recaps").then(res => {
                    set({ recaps: res.data });
                    return res.data;
                });
            },
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
            // We don't need partialize anymore because we aren't storing the promise in the state
        }
    )
);

export const useStore = createUseStore(store);
