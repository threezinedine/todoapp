import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import clsx from 'clsx'
import styles from './Toast.module.scss'
import type {
	ToastHandle,
	ToastItemInput,
	ToastPosition,
	ToastProps,
	ToastQuickOptions,
	ToastVariant,
} from './ToastProps'

const DEFAULT_DURATION_MS = 4000
const DEFAULT_MAX_VISIBLE = 4

interface ToastEntry extends Required<
	Pick<ToastItemInput, 'message' | 'variant'>
> {
	id: string
	title?: string
	totalDurationMs: number
	elapsedMs: number
	isPaused: boolean
	actionLabel?: string
	onAction?: () => Promise<void> | void
	dataTestId?: string
}

interface ToastTiming {
	totalMs: number
	elapsedMs: number
	lastStartAt: number
	isPaused: boolean
}

export const Toast = forwardRef<ToastHandle, ToastProps>(function Toast(
	{
		position = 'top-right',
		maxVisible = DEFAULT_MAX_VISIBLE,
		defaultDurationMs = DEFAULT_DURATION_MS,
		pauseOnHover = true,
		className,
		dataTestId,
	}: ToastProps,
	ref,
) {
	const [toasts, setToasts] = useState<ToastEntry[]>([])
	const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
	const timingsRef = useRef<Record<string, ToastTiming>>({})

	const updateToastState = useCallback(
		(id: string, updater: (toast: ToastEntry) => ToastEntry) => {
			setToasts((current) =>
				current.map((toast) =>
					toast.id === id ? updater(toast) : toast,
				),
			)
		},
		[],
	)

	const clearTimer = useCallback((id: string) => {
		const timer = timersRef.current[id]
		if (timer) {
			clearTimeout(timer)
			delete timersRef.current[id]
		}
	}, [])

	const removeToast = useCallback(
		(id: string) => {
			clearTimer(id)
			delete timingsRef.current[id]
			setToasts((current) => current.filter((toast) => toast.id !== id))
		},
		[clearTimer],
	)

	const scheduleDismiss = useCallback(
		(id: string, remainingMs: number) => {
			if (remainingMs <= 0) {
				removeToast(id)
				return
			}

			const timing = timingsRef.current[id]
			if (timing) {
				timing.lastStartAt = Date.now()
				timing.isPaused = false
			}

			clearTimer(id)
			timersRef.current[id] = setTimeout(() => {
				removeToast(id)
			}, remainingMs)
		},
		[clearTimer, removeToast],
	)

	const pauseToast = useCallback(
		(id: string) => {
			const timing = timingsRef.current[id]
			if (!timing || timing.isPaused) {
				return
			}

			const elapsedSinceStart = Math.max(
				0,
				Date.now() - timing.lastStartAt,
			)
			timing.elapsedMs = Math.min(
				timing.totalMs,
				timing.elapsedMs + elapsedSinceStart,
			)
			timing.isPaused = true

			clearTimer(id)
			updateToastState(id, (toast) => ({
				...toast,
				elapsedMs: timing.elapsedMs,
				isPaused: true,
			}))
		},
		[clearTimer, updateToastState],
	)

	const resumeToast = useCallback(
		(id: string) => {
			const timing = timingsRef.current[id]
			if (!timing || !timing.isPaused) {
				return
			}

			const remainingMs = Math.max(0, timing.totalMs - timing.elapsedMs)
			if (remainingMs <= 0) {
				removeToast(id)
				return
			}

			timing.isPaused = false
			scheduleDismiss(id, remainingMs)
			updateToastState(id, (toast) => ({
				...toast,
				isPaused: false,
			}))
		},
		[removeToast, scheduleDismiss, updateToastState],
	)

	const show = useCallback(
		(input: ToastItemInput) => {
			const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
			const totalDurationMs = input.durationMs ?? defaultDurationMs

			timingsRef.current[id] = {
				totalMs: totalDurationMs,
				elapsedMs: 0,
				lastStartAt: Date.now(),
				isPaused: false,
			}

			const entry: ToastEntry = {
				id,
				title: input.title,
				message: input.message,
				variant: input.variant ?? 'info',
				totalDurationMs,
				elapsedMs: 0,
				isPaused: false,
				actionLabel: input.actionLabel,
				onAction: input.onAction,
				dataTestId: input.dataTestId,
			}

			setToasts((current) => {
				const next = [entry, ...current]
				if (next.length <= maxVisible) {
					return next
				}

				const dropped = next.slice(maxVisible)
				dropped.forEach((toast) => {
					clearTimer(toast.id)
					delete timingsRef.current[toast.id]
				})
				return next.slice(0, maxVisible)
			})

			scheduleDismiss(id, totalDurationMs)
			return id
		},
		[clearTimer, defaultDurationMs, maxVisible, scheduleDismiss],
	)

	const withVariant = useCallback(
		(
			variant: ToastVariant,
			message: string,
			options?: ToastQuickOptions,
		) => {
			return show({
				...options,
				message,
				variant,
			})
		},
		[show],
	)

	const clear = useCallback(() => {
		Object.keys(timersRef.current).forEach((id) => clearTimer(id))
		timingsRef.current = {}
		setToasts([])
	}, [clearTimer])

	useImperativeHandle(
		ref,
		() => ({
			show,
			success: (message, options) =>
				withVariant('success', message, options),
			error: (message, options) => withVariant('error', message, options),
			warning: (message, options) =>
				withVariant('warning', message, options),
			info: (message, options) => withVariant('info', message, options),
			close: removeToast,
			clear,
		}),
		[clear, removeToast, show, withVariant],
	)

	useEffect(() => {
		return () => {
			Object.values(timersRef.current).forEach((timer) =>
				clearTimeout(timer),
			)
			timersRef.current = {}
			timingsRef.current = {}
		}
	}, [])

	if (toasts.length === 0) {
		return null
	}

	return (
		<div
			className={clsx(
				styles.container,
				styles[position as ToastPosition],
				className,
			)}
			aria-live="polite"
			aria-atomic="false"
			data-testid={dataTestId}
		>
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={clsx(styles.toast, styles[toast.variant])}
					onMouseEnter={() => {
						if (!pauseOnHover) {
							return
						}
						pauseToast(toast.id)
					}}
					onMouseLeave={() => {
						if (!pauseOnHover) {
							return
						}
						resumeToast(toast.id)
					}}
					data-testid={
						toast.dataTestId ??
						`${dataTestId ?? 'toast'}-item-${toast.id}`
					}
				>
					<div className={styles.progressTrack}>
						<div
							className={styles.progressBar}
							style={{
								['--toast-progress-duration' as string]: `${toast.totalDurationMs}ms`,
								['--toast-progress-delay' as string]: `-${toast.elapsedMs}ms`,
								['--toast-progress-play-state' as string]:
									toast.isPaused ? 'paused' : 'running',
							}}
							data-testid={`${toast.dataTestId ?? `${dataTestId ?? 'toast'}-item-${toast.id}`}-progress`}
						></div>
					</div>
					<div className={styles.content}>
						{toast.title && (
							<strong className={styles.title}>
								{toast.title}
							</strong>
						)}
						<p className={styles.message}>{toast.message}</p>
						{toast.actionLabel && toast.onAction && (
							<button
								type="button"
								className={styles.actionButton}
								onClick={() => toast.onAction?.()}
							>
								{toast.actionLabel}
							</button>
						)}
					</div>
					<button
						type="button"
						className={styles.closeButton}
						onClick={() => removeToast(toast.id)}
						aria-label="Dismiss notification"
					>
						x
					</button>
				</div>
			))}
		</div>
	)
})

Toast.displayName = 'Toast'
