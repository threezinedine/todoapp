import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from './Navbar'
import { PomodoroIcon } from '~/icons/PomodoroIcon'
import { Button } from '../button'
import { Avatar } from '../avatar'

const meta: Meta<typeof Navbar> = {
	component: Navbar,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Navbar>

export const NoLoggedIn: Story = {
	render: () => (
		<div style={{ backgroundColor: '#252525', height: '100vh' }}>
			<Navbar
				icon={<PomodoroIcon />}
				rightSide={
					<Button
						variant="glick-black"
						text="Login"
						borderRadius="none"
					/>
				}
			/>
		</div>
	),
}

export const LoginPage: Story = {
	render: () => (
		<div style={{ backgroundColor: '#252525', height: '100vh' }}>
			<Navbar icon={<PomodoroIcon />} />
		</div>
	),
}

export const LoggedIn: Story = {
	render: () => (
		<div style={{ backgroundColor: '#252525', height: '100vh' }}>
			<Navbar
				icon={<PomodoroIcon />}
				rightSide={
					<Button
						variant="glick-black"
						text="Logout"
						borderRadius="none"
					/>
				}
			/>
		</div>
	),
}

export const WithUserInfo: Story = {
	render: () => (
		<div style={{ backgroundColor: '#252525', height: '100vh' }}>
			<Navbar
				icon={<PomodoroIcon />}
				rightSide={
					<Avatar
						url="https://avatars.githubusercontent.com/u/105328?v=4"
						size={48}
						status="online"
					/>
				}
			/>
		</div>
	),
}
