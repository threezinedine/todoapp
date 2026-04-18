import type { Meta, StoryObj } from '@storybook/react'
import { DropMenu } from './DropMenu'
import { ProfileIcon, SettingsIcon, LogoutIcon } from '~/icons'

const meta: Meta<typeof DropMenu> = {
	component: DropMenu,
	tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof DropMenu>

export const Default: Story = {
	render: () => (
		<div
			style={{
				backgroundColor: '#252525',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<DropMenu
				isOpen={true}
				items={[
					{
						label: 'Profile',
						icon: <ProfileIcon />,
						onClick: async () => alert('Profile clicked'),
					},
					{
						label: 'Settings',
						icon: <SettingsIcon />,
						onClick: async () => alert('Settings clicked'),
					},
					{ isSeparator: true },
					{
						label: 'Logout',
						icon: <LogoutIcon />,
						onClick: async () => alert('Logout clicked'),
					},
				]}
			/>
		</div>
	),
}
