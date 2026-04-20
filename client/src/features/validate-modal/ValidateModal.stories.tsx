import type { Meta, StoryObj } from '@storybook/react'
import { ValidateModal } from './ValidateModal'

const meta: Meta<typeof ValidateModal> = {
	component: ValidateModal,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ValidateModal>

export const Default: Story = {
	render: () => (
		<ValidateModal
			onCancel={async () => alert('On cancel')}
			onConfirm={async () => alert('on Confirm')}
			content="Testing"
		/>
	),
}
