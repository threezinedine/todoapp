import { createRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Toast } from './Toast'
import type { ToastHandle } from './ToastProps'

vi.mock('./Toast.module.scss', () => ({
	default: {
		container: 'container',
		'top-right': 'top-right',
		'top-left': 'top-left',
		'bottom-right': 'bottom-right',
		'bottom-left': 'bottom-left',
		toast: 'toast',
		progressTrack: 'progressTrack',
		progressBar: 'progressBar',
		content: 'content',
		title: 'title',
		message: 'message',
		actionButton: 'actionButton',
		closeButton: 'closeButton',
		info: 'info',
		success: 'success',
		warning: 'warning',
		error: 'error',
	},
}))

describe('Toast', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.clearAllTimers()
		vi.useRealTimers()
	})

	it('shows toast items via imperative API', () => {
		const toastRef = createRef<ToastHandle>()

		render(
			<Toast
				ref={toastRef}
				dataTestId="toast"
			/>,
		)

		act(() => {
			toastRef.current?.show({
				title: 'Saved',
				message: 'Task saved successfully',
				variant: 'success',
			})
		})

		expect(screen.getByText('Saved')).toBeInTheDocument()
		expect(screen.getByText('Task saved successfully')).toBeInTheDocument()
		expect(screen.getByTestId('toast').firstChild).toHaveClass('toast')
		expect(screen.getByTestId('toast').firstChild).toHaveClass('success')
		expect(
			screen.getByText('Task saved successfully').parentElement
				?.previousElementSibling?.firstElementChild,
		).toHaveClass('progressBar')
	})

	it('auto dismisses items after duration', () => {
		const toastRef = createRef<ToastHandle>()

		render(
			<Toast
				ref={toastRef}
				defaultDurationMs={1000}
			/>,
		)

		act(() => {
			toastRef.current?.info('Will disappear')
		})

		expect(screen.getByText('Will disappear')).toBeInTheDocument()

		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(screen.queryByText('Will disappear')).not.toBeInTheDocument()
	})

	it('closes a specific toast by id', () => {
		const toastRef = createRef<ToastHandle>()

		render(<Toast ref={toastRef} />)

		let idOne = ''
		act(() => {
			idOne = toastRef.current?.info('First toast') ?? ''
			toastRef.current?.warning('Second toast')
		})

		expect(screen.getByText('First toast')).toBeInTheDocument()
		expect(screen.getByText('Second toast')).toBeInTheDocument()

		act(() => {
			toastRef.current?.close(idOne)
		})

		expect(screen.queryByText('First toast')).not.toBeInTheDocument()
		expect(screen.getByText('Second toast')).toBeInTheDocument()
	})

	it('runs toast action callback', () => {
		const toastRef = createRef<ToastHandle>()
		const onAction = vi.fn()

		render(<Toast ref={toastRef} />)

		act(() => {
			toastRef.current?.show({
				message: 'Sync failed',
				actionLabel: 'Retry',
				onAction,
			})
		})

		fireEvent.click(screen.getByText('Retry'))

		expect(onAction).toHaveBeenCalledTimes(1)
	})

	it('limits number of visible toasts', () => {
		const toastRef = createRef<ToastHandle>()

		render(
			<Toast
				ref={toastRef}
				maxVisible={2}
			/>,
		)

		act(() => {
			toastRef.current?.info('One')
			toastRef.current?.info('Two')
			toastRef.current?.info('Three')
		})

		expect(screen.queryByText('One')).not.toBeInTheDocument()
		expect(screen.getByText('Two')).toBeInTheDocument()
		expect(screen.getByText('Three')).toBeInTheDocument()
	})

	it('pauses and resumes the remaining time on hover', () => {
		const toastRef = createRef<ToastHandle>()

		render(<Toast ref={toastRef} />)

		act(() => {
			toastRef.current?.show({
				message: 'Hover to pause',
				durationMs: 1000,
				dataTestId: 'hover-toast',
			})
		})

		expect(screen.getByTestId('hover-toast-progress')).toBeInTheDocument()

		act(() => {
			vi.advanceTimersByTime(400)
		})

		act(() => {
			fireEvent.mouseEnter(screen.getByTestId('hover-toast'))
		})

		act(() => {
			vi.advanceTimersByTime(1000)
		})

		expect(screen.getByText('Hover to pause')).toBeInTheDocument()

		act(() => {
			fireEvent.mouseLeave(screen.getByTestId('hover-toast'))
		})

		act(() => {
			vi.advanceTimersByTime(599)
		})

		expect(screen.getByText('Hover to pause')).toBeInTheDocument()

		act(() => {
			vi.advanceTimersByTime(1)
		})

		expect(screen.queryByText('Hover to pause')).not.toBeInTheDocument()
	})
})
