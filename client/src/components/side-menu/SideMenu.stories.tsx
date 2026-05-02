import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SideMenu } from './SideMenu'

const meta: Meta<typeof SideMenu> = {
	title: 'Components/SideMenu',
	component: SideMenu,
}

const defaultProps: CSSProperties = {
	backgroundColor: '#5e5e5e',
	position: 'relative',
	padding: '0',
	margin: '0',
	height: '100vh',
}

export default meta

type Story = StoryObj<typeof SideMenu>

export const Open: Story = {
	render: () => {
		return (
			<div style={{ ...defaultProps }}>
				<SideMenu isOpen={true} />
			</div>
		)
	},
}

export const Closed: Story = {
	render: () => {
		return (
			<div style={{ ...defaultProps }}>
				<SideMenu isOpen={false} />
			</div>
		)
	},
}
