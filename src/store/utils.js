import { useStore } from "zustand";

export const createUseStore = (store) => (selector, equals) =>
  useStore(store, selector, equals);
