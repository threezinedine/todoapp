import { useEffect, useState } from 'react'
import { Button } from '~/components'
import { TasksList } from '../tasks-list'
import styles from './TasksContainer.module.scss'
import { NewTaskModal } from '../new-task-modal/NewTaskModal'
import clsx from 'clsx'
import { useTasksStore } from '../../stores/TaskStore'

export function TasksContainer() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { tasks, isTasksLoading, fetchTasks } = useTasksStore()

	useEffect(() => {
		fetchTasks()
	}, [])

	function onCreateTaskSuccess() {
		alert('Task created successfully!')
		setIsModalOpen(false)
		fetchTasks()
	}

	function onCreateTaskFailed(response: Response) {
		response.json().then((data) => {
			console.error('Failed to create task:', data)
		})
		setIsModalOpen(false)
	}

	function onCreateTaskError() {
		alert('Task created error')
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
