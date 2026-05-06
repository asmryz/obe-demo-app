import { create } from 'zustand'

// ─── Zustand Store ────────────────────────────────────────────────────────────

let idCounter = 0

export const useNotifyStore = create((set) => ({
    toasts: [],
    defaultPosition: 'bottom-right',

    setDefaultPosition: (position) => set({ defaultPosition: position }),

    add: (type, messageOrOptions, title) => {
        const options = typeof messageOrOptions === 'object' && messageOrOptions !== null
            ? messageOrOptions
            : { message: messageOrOptions, title }
        const toast = {
            id: ++idCounter,
            type,
            title: options.title ?? undefined,
            message: options.message ?? '',
            duration: options.duration ?? 4000,
            position: options.position, // resolved at render using defaultPosition if undefined
            ripple: options.ripple ?? true,
            dismissible: options.dismissible ?? false,
        }
        set((state) => ({ toasts: [...state.toasts, toast] }))
        return toast.id
    },

    remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function useNotify() {
    const add = useNotifyStore((s) => s.add)
    const remove = useNotifyStore((s) => s.remove)
    const defaultPosition = useNotifyStore((s) => s.defaultPosition)

    return {
        success: (msg, title, opts) => add('success', typeof opts === 'object' ? { message: msg, title, position: defaultPosition, ...opts } : (typeof msg === 'object' ? msg : { message: msg, title, position: defaultPosition })),
        error:   (msg, title, opts) => add('error',   typeof opts === 'object' ? { message: msg, title, position: defaultPosition, ...opts } : (typeof msg === 'object' ? msg : { message: msg, title, position: defaultPosition })),
        warning: (msg, title, opts) => add('warning', typeof opts === 'object' ? { message: msg, title, position: defaultPosition, ...opts } : (typeof msg === 'object' ? msg : { message: msg, title, position: defaultPosition })),
        info:    (msg, title, opts) => add('info',    typeof opts === 'object' ? { message: msg, title, position: defaultPosition, ...opts } : (typeof msg === 'object' ? msg : { message: msg, title, position: defaultPosition })),
        dismiss: remove,
    }
}
