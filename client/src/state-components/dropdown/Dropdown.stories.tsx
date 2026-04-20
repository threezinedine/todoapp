import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'
import { Button } from '~/components/button'

const meta: Meta<typeof Dropdown> = {
	component: Dropdown,
	tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
	render: () => (
		<div style={{ padding: '20px' }}>
			<Dropdown
				items={[
					{
						label: 'Option 1',
						onClick: async () => alert('Option 1 clicked'),
					},
					{
						label: 'Option 2',
						onClick: async () => alert('Option 2 clicked'),
					},
					{
						label: 'Option 3',
						onClick: async () => alert('Option 3 clicked'),
					},
				]}
			>
				<Button text="Open Dropdown" />
			</Dropdown>
		</div>
	),
}
