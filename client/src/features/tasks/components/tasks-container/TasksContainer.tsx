import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components'
import { TasksList } from '../tasks-list'
import styles from './TasksContainer.module.scss'
import { NewTaskModal } from '../new-task-modal/NewTaskModal'
import clsx from 'clsx'
import { useTasksStore } from '../../stores/TaskStore'
import { toast } from '~/stores'
import {
	Dropdown,
	ValidateModal,
	type ValidateModalHandle,
} from '~/state-components'
import { AddIcon } from '~/icons'

export function TasksContainer({
	onTaskOpen,
}: {
	onTaskOpen?: (taskId: string) => Promise<void> | void
}) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const {
		tasks,
		isTasksLoading,
		fetchTasks,
		deleteTask,
		resetSelected,
		selectTask,
	} = useTasksStore()
	const [isSelectMode, setIsSelectMode] = useState(false)
	const selectedModalRef = useRef<ValidateModalHandle>(null)

	useEffect(() => {
		fetchTasks()
	}, [])

	function onCreateTaskSuccess() {
		toast.success('Task created successfully!', {
			title: 'Success',
		})
		setIsModalOpen(false)
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
						text={isSelectMode ? 'Exit' : 'Select'}
						dataTestId="select-tasks-button"
						onClick={() => {
							setIsSelectMode((current) => !current)
							resetSelected()
						}}
					/>
					{isSelectMode && (
						<Button
							variant="glass-morphism"
							text="Delete"
							dataTestId="delete-selected-tasks-button"
							onClick={() => {
								if (
									isSelectMode &&
									tasks.some((task) => task.isSelected)
								) {
									selectedModalRef.current?.open()
								} else {
									toast.warning('No tasks selected', {
										title: 'Delete Selected Tasks',
									})
								}
							}}
						/>
					)}
					{!isSelectMode && (
						<Dropdown
							items={[
								{
									label: 'Add Task',
									onClick: () => setIsModalOpen(true),
									testId: 'add-task-dropdown-item',
									icon: <AddIcon />,
								},
							]}
						>
							<Button
								variant="glass-morphism"
								text="Add"
								dataTestId="add-button"
							/>
						</Dropdown>
					)}
				</div>
				<div className={clsx(styles.list)}>
					<TasksList
						isLoading={isTasksLoading}
						tasks={tasks}
						testId="tasks-list"
						onTaskReorder={() => {}}
						onTaskOpen={onTaskOpen}
						onTaskDelete={deleteTask}
						variant={isSelectMode ? 'name-select' : 'default'}
						onTaskSelectedChange={(taskId, isSelected) => {
							if (isSelectMode) {
								selectTask?.(taskId, isSelected)
							}
						}}
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
			<ValidateModal
				ref={selectedModalRef}
				content={'Delete selected tasks?'}
				dataTestId="delete-selected-tasks-confirm-modal"
				onCancel={() => {
					resetSelected()
					selectedModalRef.current?.close()
				}}
				onConfirm={async () => {
					resetSelected()
					selectedModalRef.current?.close()

					for (const task of tasks) {
						if (task.isSelected) {
							await deleteTask?.(task.taskId)
						}
					}

					await fetchTasks()
				}}
			/>
		</div>
	)
}
