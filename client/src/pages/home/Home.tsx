import styles from './Home.module.scss'
import clsx from 'clsx'
import { TasksContainer } from '~/features/tasks'
import { CalendarViewContainer } from '~/features/calendar-view'
import { useAuthStore } from '~/stores'

export function Home() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

	return (
		<div className={clsx(styles.wrapper)}>
			<div className={clsx(styles.container)}>
				{!isAuthenticated ? (
					<div className={clsx(styles.todo)}>
						Please log in to view your tasks.
					</div>
				) : (
					<>
						<div className={clsx(styles.todo)}>
							<TasksContainer />
						</div>
						<div className={clsx(styles.calendar)}>
							<CalendarViewContainer />
						</div>
					</>
				)}
			</div>
		</div>
	)
}
