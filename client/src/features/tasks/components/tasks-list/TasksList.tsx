import type { TasksListProps } from './TasksListProps'
import styles from './TasksList.module.scss'
import clsx from 'clsx'
import { TaskCard } from '../task-card'

export function TasksList({ tasks, testId }: TasksListProps) {
	return (
		<div
			className={clsx(styles.container)}
			data-testid={testId}
		>
			{tasks.map((task) => (
				<TaskCard
					key={task.taskId}
					{...task}
				/>
			))}
		</div>
	)
}
