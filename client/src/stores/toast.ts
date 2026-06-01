import { create } from 'zustand'
import type {
	ToastHandle,
	ToastItemInput,
	ToastQuickOptions,
} from '~/state-components/toast/ToastProps'

interface ToastStoreState {
	handler: ToastHandle | null
	lastToastMessage: string | null
	lastToastId: string | null
	setHandler: (handler: ToastHandle | null) => void
	onToastDismissed: (id: string) => void
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

function getDuplicateToastId(state: ToastStoreState, message: string) {
	if (state.lastToastMessage === message && state.lastToastId) {
		return state.lastToastId
	}

	return null
}

export const useToastStore = create<ToastStoreState>()((set, get) => ({
	handler: null,
	lastToastMessage: null,
	lastToastId: null,
	setHandler: (handler) => set({ handler }),
	onToastDismissed: (id) => {
		if (get().lastToastId === id) {
			set({
				lastToastMessage: null,
				lastToastId: null,
			})
		}
	},
	show: (toast) => {
		const state = get()
		const duplicateToastId = getDuplicateToastId(state, toast.message)
		if (duplicateToastId) {
			return duplicateToastId
		}

		const handler = state.handler
		if (!handler) {
			return fallbackId()
		}

		const toastId = handler.show(toast)
		set({
			lastToastMessage: toast.message,
			lastToastId: toastId,
		})

		return toastId
	},
	success: (message, options) => {
		const state = get()
		const duplicateToastId = getDuplicateToastId(state, message)
		if (duplicateToastId) {
			return duplicateToastId
		}

		const handler = state.handler
		if (!handler) {
			return fallbackId()
		}

		const toastId = handler.success(message, options)
		set({
			lastToastMessage: message,
			lastToastId: toastId,
		})

		return toastId
	},
	error: (message, options) => {
		const state = get()
		const duplicateToastId = getDuplicateToastId(state, message)
		if (duplicateToastId) {
			return duplicateToastId
		}

		const handler = state.handler
		if (!handler) {
			return fallbackId()
		}

		const toastId = handler.error(message, options)
		set({
			lastToastMessage: message,
			lastToastId: toastId,
		})

		return toastId
	},
	warning: (message, options) => {
		const state = get()
		const duplicateToastId = getDuplicateToastId(state, message)
		if (duplicateToastId) {
			return duplicateToastId
		}

		const handler = state.handler
		if (!handler) {
			return fallbackId()
		}

		const toastId = handler.warning(message, options)
		set({
			lastToastMessage: message,
			lastToastId: toastId,
		})

		return toastId
	},
	info: (message, options) => {
		const state = get()
		const duplicateToastId = getDuplicateToastId(state, message)
		if (duplicateToastId) {
			return duplicateToastId
		}

		const handler = state.handler
		if (!handler) {
			return fallbackId()
		}

		const toastId = handler.info(message, options)
		set({
			lastToastMessage: message,
			lastToastId: toastId,
		})

		return toastId
	},
	close: (id) => {
		get().handler?.close(id)

		if (get().lastToastId === id) {
			set({
				lastToastMessage: null,
				lastToastId: null,
			})
		}
	},
	clear: () => {
		get().handler?.clear()
		set({
			lastToastMessage: null,
			lastToastId: null,
		})
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
