import styles from './Home.module.scss'
import clsx from 'clsx'
import { TasksContainer } from '~/features/tasks'
import { useAuthStore } from '~/stores'

export function Home() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

	return (
		<>
			{!isAuthenticated ? (
				<div className={clsx(styles.container)}>
					<div className={clsx(styles.todo)}>
						Please log in to view your tasks.
					</div>
				</div>
			) : (
				<div className={clsx(styles.wrapper)}>
					<div className={clsx(styles.container)}>
						<div className={clsx(styles.todo)}>
							<TasksContainer />
						</div>
						<div className={clsx(styles.calendar)}>Calendar</div>
					</div>
				</div>
			)}
		</>
	)
}
