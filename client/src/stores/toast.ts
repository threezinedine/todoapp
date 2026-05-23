import { create } from 'zustand'
import type {
	ToastHandle,
	ToastItemInput,
	ToastQuickOptions,
} from '~/state-components/toast/ToastProps'

interface ToastStoreState {
	handler: ToastHandle | null
	setHandler: (handler: ToastHandle | null) => void
	show: (toast: ToastItemInput) => string
	success: (message: string, options?: ToastQuickOptions) => string
	error: (message: string, options?: ToastQuickOptions) => string
	warning: (message: string, options?: ToastQuickOptions) => string
	info: (message: string, options?: ToastQuickOptions) => string
	close: (id: string) => void
	clear: () => void
}

function fallbackId() {
	return `toast-fallback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useToastStore = create<ToastStoreState>()((set, get) => ({
	handler: null,
	setHandler: (handler) => set({ handler }),
	show: (toast) => {
		const handler = get().handler
		if (!handler) {
			return fallbackId()
		}

		return handler.show(toast)
	},
	success: (message, options) => {
		const handler = get().handler
		if (!handler) {
			return fallbackId()
		}

		return handler.success(message, options)
	},
	error: (message, options) => {
		const handler = get().handler
		if (!handler) {
			return fallbackId()
		}

		return handler.error(message, options)
	},
	warning: (message, options) => {
		const handler = get().handler
		if (!handler) {
			return fallbackId()
		}

		return handler.warning(message, options)
	},
	info: (message, options) => {
		const handler = get().handler
		if (!handler) {
			return fallbackId()
		}

		return handler.info(message, options)
	},
	close: (id) => {
		get().handler?.close(id)
	},
	clear: () => {
		get().handler?.clear()
	},
}))

export const toast = {
	show: (toastInput: ToastItemInput) =>
		useToastStore.getState().show(toastInput),
	success: (message: string, options?: ToastQuickOptions) =>
		useToastStore.getState().success(message, options),
	error: (message: string, options?: ToastQuickOptions) =>
		useToastStore.getState().error(message, options),
	warning: (message: string, options?: ToastQuickOptions) =>
		useToastStore.getState().warning(message, options),
	info: (message: string, options?: ToastQuickOptions) =>
		useToastStore.getState().info(message, options),
	close: (id: string) => useToastStore.getState().close(id),
	clear: () => useToastStore.getState().clear(),
}
