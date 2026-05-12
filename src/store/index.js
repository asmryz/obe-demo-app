import { createStore } from "zustand/vanilla";
import { useStore as useZustandStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const createUseStore = (store) => (selector, equals) =>
  useZustandStore(store, selector, equals);

export const store = createStore()(
  persist(
    (set) => ({
      initialized: false,
      signedIn: false,
      signIn: () => set({ signedIn: true }),
      signOut: () => set({ signedIn: false }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useStore = createUseStore(store);
