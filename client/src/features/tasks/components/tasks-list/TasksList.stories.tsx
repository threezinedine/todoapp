import type { Meta, StoryObj } from '@storybook/react'
import { TasksList } from './TasksList'

const meta: Meta<typeof TasksList> = {
	component: TasksList,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TasksList>

export const Default: Story = {
	render: () => {
		return (
			<div
				style={{
					backgroundColor: '#353535',
					width: '100%',
					height: '100vh',
					padding: '3rem',
				}}
			>
				<TasksList
					onTaskReorder={(sourceTaskId, targetTaskId, position) => {
						alert(
							`Reorder task ${sourceTaskId} ${position} task ${targetTaskId}`,
						)
					}}
					tasks={[
						{
							taskId: '1',
							taskName: 'Task 1',
							isComplete: false,
						},
						{
							taskId: '2',
							taskName: 'Task 2',
							isComplete: true,
						},
						{
							taskId: '3',
							taskName: 'Task 3',
							isComplete: false,
						},
						{
							taskId: '4',
							taskName: 'Task 4',
							isComplete: false,
						},
					]}
				/>
			</div>
		)
	},
}
