import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
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
					onTaskOpen={(taskId) => {
						alert(`Open task id ${taskId}`)
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

export const Loading: Story = {
	render: () => {
		return (
			<div
				style={{
					backgroundColor: '#353535',
					width: '100%',
					height: '100vh',
					padding: '3rem',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<TasksList
					tasks={[
						{
							taskId: '1',
							taskName: 'Task 1',
							isComplete: false,
						},
					]}
					isLoading
					onTaskReorder={() => {}}
				/>
			</div>
		)
	},
}

export const SelectOnly: Story = {
	render: () => {
		const [tasks, setTasks] = useState([
			{
				taskId: '1',
				taskName: 'Task 1',
				isSelected: false,
			},
			{
				taskId: '2',
				taskName: 'Task 2',
				isSelected: true,
			},
			{
				taskId: '3',
				taskName: 'Task 3',
				isSelected: false,
			},
		])

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
					variant="name-select"
					tasks={tasks}
					onTaskSelectedChange={(taskId, isSelected) => {
						setTasks((currentTasks) =>
							currentTasks.map((task) =>
								task.taskId === taskId
									? {
											...task,
											isSelected,
										}
									: task,
							),
						)
					}}
				/>
			</div>
		)
	},
}

export const ToggleModes: Story = {
	render: () => {
		const [variant, setVariant] = useState<'default' | 'name-select'>(
			'default',
		)
		const [tasks, setTasks] = useState([
			{
				taskId: '1',
				taskName: 'Task 1',
				isComplete: false,
				isSelected: false,
			},
			{
				taskId: '2',
				taskName: 'Task 2',
				isComplete: true,
				isSelected: true,
			},
			{
				taskId: '3',
				taskName: 'Task 3',
				isComplete: false,
				isSelected: false,
			},
		])

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
					Toggle list mode (current: {variant})
				</button>

				<TasksList
					variant={variant}
					tasks={tasks}
					onTaskOpen={(taskId) => {
						alert(`Open task id ${taskId}`)
					}}
					onTaskSelectedChange={(taskId, isSelected) => {
						setTasks((currentTasks) =>
							currentTasks.map((task) =>
								task.taskId === taskId
									? {
											...task,
											isSelected,
										}
									: task,
							),
						)
					}}
					onTaskReorder={(sourceTaskId, targetTaskId, position) => {
						alert(
							`Reorder task ${sourceTaskId} ${position} task ${targetTaskId}`,
						)
					}}
				/>
			</div>
		)
	},
}
