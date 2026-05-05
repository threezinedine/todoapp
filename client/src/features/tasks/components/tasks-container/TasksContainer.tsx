import { TasksList } from '../tasks-list'
import styles from './TasksContainer.module.scss'
import clsx from 'clsx'

export function TasksContainer() {
	return (
		<div className={clsx(styles.container)}>
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
	)
}
