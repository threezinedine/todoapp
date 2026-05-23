export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export type ToastPosition =
	| 'top-right'
	| 'top-left'
	| 'bottom-right'
	| 'bottom-left'

export interface ToastItemInput {
	title?: string
	message: string
	variant?: ToastVariant
	durationMs?: number
	actionLabel?: string
	onAction?: () => Promise<void> | void
	dataTestId?: string
}

export interface ToastQuickOptions extends Omit<
	ToastItemInput,
	'message' | 'variant'
> {}

export interface ToastHandle {
	show: (toast: ToastItemInput) => string
	success: (message: string, options?: ToastQuickOptions) => string
	error: (message: string, options?: ToastQuickOptions) => string
	warning: (message: string, options?: ToastQuickOptions) => string
	info: (message: string, options?: ToastQuickOptions) => string
	close: (id: string) => void
	clear: () => void
}

export interface ToastProps {
	position?: ToastPosition
	maxVisible?: number
	defaultDurationMs?: number
	pauseOnHover?: boolean
	className?: string
	dataTestId?: string
}
