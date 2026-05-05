import type { Meta, StoryObj } from '@storybook/react'
import { TasksContainer } from './TasksContainer'

const meta: Meta<typeof TasksContainer> = {
	component: TasksContainer,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TasksContainer>

export const Default: Story = {
	render: () => {
		return (
			<div
				style={{
					backgroundColor: '#353535',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100vh',
				}}
			>
				<div style={{ backgroundColor: '#5a5a5a99' }}>
					<TasksContainer />
				</div>
				<div
					style={{
						backgroundColor: '#9999',
					}}
				>
					Other
				</div>
			</div>
		)
	},
}
