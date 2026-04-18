import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
	component: Avatar,
	tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
	args: {
		url: 'https://avatars.githubusercontent.com/u/105328?v=4',
		size: 48,
	},
}

export const FallbackInitials: Story = {
	args: {
		name: 'John Doe',
		size: 48,
	},
}

export const Variants: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				gap: '16px',
				backgroundColor: '#202020',
				padding: '16px',
			}}
		>
			<Avatar
				url="https://avatars.githubusercontent.com/u/105328?v=4"
				size={48}
				status="online"
			/>
			<Avatar
				url="https://avatars.githubusercontent.com/u/105328?v=4"
				size={48}
				status="busy"
			/>
			<Avatar
				url="https://avatars.githubusercontent.com/u/105328?v=4"
				size={48}
				status="away"
			/>
			<Avatar
				url="https://avatars.githubusercontent.com/u/105328?v=4"
				size={48}
				status="offline"
			/>
		</div>
	),
}
