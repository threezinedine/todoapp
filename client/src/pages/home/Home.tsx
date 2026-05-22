import { useRef } from 'react'
import styles from './Home.module.scss'
import clsx from 'clsx'
import { TasksContainer } from '~/features/tasks'
import { CalendarViewContainer } from '~/features/calendar-view'
import { useAuthStore } from '~/stores'
import { TimeModal, useTimeStore } from '~/features/pomodoro'
import type { TimeModalHandle } from '~/features/pomodoro'

export function Home() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const timeModalRef = useRef<TimeModalHandle>(null)
	const { assignTask } = useTimeStore()

	const handleOpenTimeModal = (taskId: string) => {
		assignTask(taskId)
		if (timeModalRef.current) {
			timeModalRef.current.toggle()
			timeModalRef.current.toWork()
		}
	}

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
							<TasksContainer onTaskOpen={handleOpenTimeModal} />
						</div>
						<div className={clsx(styles.calendar)}>
							<CalendarViewContainer />
						</div>
						<TimeModal ref={timeModalRef} />
					</>
				)}
			</div>
		</div>
	)
}
