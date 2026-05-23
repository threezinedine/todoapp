import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { Toast } from './Toast'
import type { ToastHandle } from './ToastProps'

const meta: Meta<typeof Toast> = {
	title: 'State Components/Toast',
	component: Toast,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Toast>

export const Playground: Story = {
	render: () => {
		const toastRef = useRef<ToastHandle>(null)

		return (
			<div style={{ padding: '1rem', minHeight: '160px' }}>
				<div
					style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
				>
					<button
						type="button"
						onClick={() =>
							toastRef.current?.success(
								'Task created successfully',
								{
									title: 'Success',
								},
							)
						}
					>
						Success
					</button>
					<button
						type="button"
						onClick={() =>
							toastRef.current?.info('Task moved to backlog', {
								title: 'Info',
							})
						}
					>
						Info
					</button>
					<button
						type="button"
						onClick={() =>
							toastRef.current?.warning('Due date is close', {
								title: 'Warning',
								durationMs: 6000,
							})
						}
					>
						Warning
					</button>
					<button
						type="button"
						onClick={() =>
							toastRef.current?.error(
								'Could not save your task',
								{
									title: 'Error',
									actionLabel: 'Retry',
									onAction: () => {
										alert('Retry clicked')
									},
								},
							)
						}
					>
						Error
					</button>
				</div>
				<Toast
					ref={toastRef}
					dataTestId="toast-story"
				/>
			</div>
		)
	},
}
