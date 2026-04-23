import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TaskCard } from './TaskCard'

const meta: Meta<typeof TaskCard> = {
	component: TaskCard,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TaskCard>

export const Default: Story = {
	render: () => {
		const [isComplete, setIsComplete] = useState(false)

		return (
			<div
				style={{
					backgroundColor: '#353535',
					width: '100%',
					height: '100vh',
					padding: '3rem',
				}}
			>
				<TaskCard
					taskName="Test 1"
					isComplete={isComplete}
					onCompleteChange={async (newIsComplete) => {
						// Simulate an async operation, e.g., API call
						await new Promise((resolve) => setTimeout(resolve, 500))
						console.log(
							'Task completion status changed:',
							newIsComplete,
						)
						setIsComplete(newIsComplete)
					}}
				/>
			</div>
		)
	},
}
