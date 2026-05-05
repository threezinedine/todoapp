import { Button } from '~/components'
import { TasksList } from '../tasks-list'
import styles from './TasksContainer.module.scss'
import clsx from 'clsx'

export function TasksContainer() {
	return (
		<div className={clsx(styles.wrapper)}>
			<div className={clsx(styles.container)}>
				<div className={clsx(styles.header)}>
					<Button
						variant="glass-morphism"
						text="Add Task"
						onClick={() => alert('Add Task')}
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
		</div>
	)
}
