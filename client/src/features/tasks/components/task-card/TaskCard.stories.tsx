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
					onSettings={() => alert('Setting')}
					onDelete={() => alert('Delete')}
					onOpenPomodoro={() => alert('Open Pomodoro')}
				/>
			</div>
		)
	},
}

export const NameAndSelectOnly: Story = {
	render: () => {
		const [isSelected, setIsSelected] = useState(false)

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
					taskName="Select-only task"
					variant="name-select"
					isSelected={isSelected}
					onSelectedChange={(newIsSelected) => {
						setIsSelected(newIsSelected)
					}}
				/>
			</div>
		)
	},
}

export const ToggleVariants: Story = {
	render: () => {
		const [variant, setVariant] = useState<'default' | 'name-select'>(
			'default',
		)
		const [isComplete, setIsComplete] = useState(false)
		const [isSelected, setIsSelected] = useState(false)

		return (
			<div
				style={{
					backgroundColor: '#353535',
					width: '100%',
					height: '100vh',
					padding: '3rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
				}}
			>
				<button
					type="button"
					onClick={() => {
						setVariant((currentVariant) =>
							currentVariant === 'default'
								? 'name-select'
								: 'default',
						)
					}}
					style={{
						width: 'fit-content',
						padding: '0.5rem 0.75rem',
						borderRadius: '0.5rem',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					Toggle variant (current: {variant})
				</button>

				<TaskCard
					taskName="Task variant demo"
					variant={variant}
					isComplete={isComplete}
					isSelected={isSelected}
					onCompleteChange={(newIsComplete) => {
						setIsComplete(newIsComplete)
					}}
					onSelectedChange={(newIsSelected) => {
						setIsSelected(newIsSelected)
					}}
					onSettings={() => alert('Setting')}
					onDelete={() => alert('Delete')}
					onOpenPomodoro={() => alert('Open Pomodoro')}
				/>
			</div>
		)
	},
}
