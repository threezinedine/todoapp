import type { Meta, StoryObj } from '@storybook/react'
import { MenuToggle } from './MenuToggle'
import { useState } from 'react'

const meta: Meta<typeof MenuToggle> = {
	component: MenuToggle,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MenuToggle>

export const Close: Story = {
	render: () => (
		<div
			style={{
				backgroundColor: '#252525',
				height: '100vh',
				padding: '2rem',
			}}
		>
			<MenuToggle
				isOpen={false}
				onClick={() => {}}
				dataTestId="menu-toggle"
			/>
		</div>
	),
}

export const Open: Story = {
	render: () => (
		<div
			style={{
				backgroundColor: '#252525',
				height: '100vh',
				padding: '2rem',
			}}
		>
			<MenuToggle
				isOpen={true}
				onClick={() => {}}
				dataTestId="menu-toggle"
			/>
		</div>
	),
}

export const Toggle: Story = {
	render: () => {
		const [isOpen, setIsOpen] = useState(false)

		const handleClick = () => {
			setIsOpen((prev) => !prev)
		}

		return (
			<div
				style={{
					backgroundColor: '#252525',
					height: '100vh',
					padding: '2rem',
				}}
			>
				<MenuToggle
					isOpen={isOpen}
					onClick={handleClick}
					dataTestId="menu-toggle"
				/>
			</div>
		)
	},
}
