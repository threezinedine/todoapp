import type { Meta, StoryObj } from '@storybook/react'
import { NewTaskModal } from './NewTaskModal'
import { useState } from 'storybook/internal/preview-api'

const meta: Meta<typeof NewTaskModal> = {
	component: NewTaskModal,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NewTaskModal>

export const Default: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(true)

		return (
			<>
				<NewTaskModal
					isOpen={isOpen}
					onCreate={(title) => {
						console.log('Task Created:', title)
						setIsOpen(false)
					}}
				/>
			</>
		)
	},
}
