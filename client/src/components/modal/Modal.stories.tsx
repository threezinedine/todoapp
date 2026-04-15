import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '~/components/button'
import { useState } from 'react'

const meta: Meta<typeof Modal> = {
	component: Modal,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(false)

		return (
			<div style={{ padding: '2rem' }}>
				<Button
					onClick={async () => setIsOpen(true)}
					text="Open Modal"
				/>
				<Modal
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
				>
					<div
						style={{
							padding: '2rem',
							borderRadius: '8px',
							color: 'var(--text-color)',
						}}
					>
						<h2>Modal Content</h2>
						<p>This is a simple modal example.</p>
						<Button
							variant="glick"
							onClick={async () => setIsOpen(false)}
							text="Close Modal"
						/>
					</div>
				</Modal>
			</div>
		)
	},
}
