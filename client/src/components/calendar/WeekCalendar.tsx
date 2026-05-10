import type { CalendarComponentProps } from './CalendarProps'
import styles from './DayCalendar.module.scss'
import clsx from 'clsx'

export function WeekCalendar({
	startDate = new Date(),
	endDate = new Date(),
}: CalendarComponentProps) {
	return (
		<div className={clsx(styles.container)}>
			<h2 className={clsx(styles.title)}>Week Calendar</h2>
			<p>Start Date: {startDate.toDateString()}</p>
			<p>End Date: {endDate.toDateString()}</p>
		</div>
	)
}
