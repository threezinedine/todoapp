import type { Meta, StoryObj } from '@storybook/react'
import { NewTaskModal } from './NewTaskModal'

const meta: Meta<typeof NewTaskModal> = {
	component: NewTaskModal,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NewTaskModal>

export const Default: Story = {
	render: () => {
		return (
			<>
				<NewTaskModal
					isOpen={true}
					onSuccess={() => {
						alert('Task created successfully!')
					}}
					onFailed={(response) => {
						alert(`Failed to create task: ${response.json()}`)
					}}
					onError={(err) => {
						alert(err)
					}}
				/>
			</>
		)
	},
}
