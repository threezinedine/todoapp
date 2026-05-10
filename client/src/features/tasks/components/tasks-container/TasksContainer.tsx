import { useState } from 'react'
import { Button } from '~/components'
import { TasksList } from '../tasks-list'
import styles from './TasksContainer.module.scss'
import { NewTaskModal } from '../new-task-modal/NewTaskModal'
import clsx from 'clsx'

export function TasksContainer() {
	const [isModalOpen, setIsModalOpen] = useState(false)

	function onCreateTaskSuccess() {
		alert('Task created successfully!')
		setIsModalOpen(false)
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
					/>
				</div>
				<div className={clsx(styles.list)}>
					<TasksList
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
						]}
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
