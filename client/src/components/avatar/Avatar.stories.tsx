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

export const Small: Story = {
	args: {
		url: 'https://avatars.githubusercontent.com/u/105328?v=4',
		size: 32,
	},
}

export const Large: Story = {
	args: {
		url: 'https://avatars.githubusercontent.com/u/105328?v=4',
		size: 80,
	},
}

export const FallbackInitials: Story = {
	args: {
		name: 'John Doe',
		size: 48,
	},
}

export const Online: Story = {
	args: {
		url: 'https://avatars.githubusercontent.com/u/105328?v=4',
		size: 48,
		status: 'online',
	},
}

export const Busy: Story = {
	args: {
		url: 'https://avatars.githubusercontent.com/u/105328?v=4',
		size: 48,
		status: 'busy',
	},
}

export const Away: Story = {
	args: {
		url: 'https://avatars.githubusercontent.com/u/105328?v=4',
		size: 48,
		status: 'away',
	},
}

export const Offline: Story = {
	args: {
		url: 'https://avatars.githubusercontent.com/u/105328?v=4',
		size: 48,
		status: 'offline',
	},
}
