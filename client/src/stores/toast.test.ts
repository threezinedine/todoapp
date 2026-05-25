import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast, useToastStore } from './toast'
import type { ToastHandle } from '~/state-components/toast/ToastProps'

function createHandlerMock(): ToastHandle {
	return {
		show: vi.fn(() => 'toast-show-id'),
		success: vi.fn(() => 'toast-success-id'),
		error: vi.fn(() => 'toast-error-id'),
		warning: vi.fn(() => 'toast-warning-id'),
		info: vi.fn(() => 'toast-info-id'),
		close: vi.fn(),
		clear: vi.fn(),
	}
}

describe('toast store dedupe', () => {
	beforeEach(() => {
		useToastStore.setState({
			handler: null,
			lastToastMessage: null,
			lastToastId: null,
		})
	})

	it('blocks duplicate success message', () => {
		const handler = createHandlerMock()
		useToastStore.getState().setHandler(handler)

		const firstId = toast.success('Task created successfully!')
		const secondId = toast.success('Task created successfully!')

		expect(handler.success).toHaveBeenCalledTimes(1)
		expect(firstId).toBe('toast-success-id')
		expect(secondId).toBe('toast-success-id')
	})

	it('allows different messages', () => {
		const handler = createHandlerMock()
		useToastStore.getState().setHandler(handler)

		toast.error('Failed to create task')
		toast.error('Failed to delete task')

		expect(handler.error).toHaveBeenCalledTimes(2)
	})

	it('resets dedupe restriction after clear', () => {
		const handler = createHandlerMock()
		useToastStore.getState().setHandler(handler)

		toast.info('Sync complete')
		toast.info('Sync complete')
		expect(handler.info).toHaveBeenCalledTimes(1)

		toast.clear()
		toast.info('Sync complete')
		expect(handler.info).toHaveBeenCalledTimes(2)
	})
})
