import { useEffect, useState } from 'react'
import { Button } from '~/components'
import { TasksList } from '../tasks-list'
import styles from './TasksContainer.module.scss'
import { NewTaskModal } from '../new-task-modal/NewTaskModal'
import clsx from 'clsx'
import { useTasksStore } from '../../stores/TaskStore'
import { toast } from '~/stores'

export function TasksContainer({
	onTaskOpen,
}: {
	onTaskOpen?: (taskId: string) => Promise<void> | void
}) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { tasks, isTasksLoading, fetchTasks } = useTasksStore()

	useEffect(() => {
		fetchTasks()
	}, [])

	function onCreateTaskSuccess() {
		toast.success('Task created successfully!', {
			title: 'Success',
		})
		setIsModalOpen(false)
		fetchTasks()
	}

	function onCreateTaskFailed(response: Response) {
		response
			.json()
			.then((data) => {
				console.error('Failed to create task:', data)
				toast.error(
					data?.message ||
						response.statusText ||
						'Failed to create task',
					{
						title: 'Create Task Failed',
					},
				)
			})
			.catch(() => {
				toast.error(response.statusText || 'Failed to create task', {
					title: 'Create Task Failed',
				})
			})
		setIsModalOpen(false)
	}

	function onCreateTaskError() {
		toast.error('An unexpected error occurred while creating task.', {
			title: 'Create Task Error',
		})
		setIsModalOpen(false)
	}

	return (
		<div className={clsx(styles.wrapper)}>
			<div className={clsx(styles.container)}>
				<div className={clsx(styles.header)}>
					<Button
						variant="glass-morphism"
						text="Add Task"
						onClick={() => setIsModalOpen(true)}
						dataTestId="create-task-button"
					/>
				</div>
				<div className={clsx(styles.list)}>
					<TasksList
						isLoading={isTasksLoading}
						tasks={tasks}
						testId="tasks-list"
						onTaskReorder={() => {}}
						onTaskOpen={onTaskOpen}
					/>
				</div>
			</div>
			<NewTaskModal
				isOpen={isModalOpen}
				onSuccess={onCreateTaskSuccess}
				onFailed={onCreateTaskFailed}
				onError={onCreateTaskError}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	)
}
