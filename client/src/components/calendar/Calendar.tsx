import type { CalendarProps } from './CalendarProps'
import { DayCalendar } from './DayCalendar'
import { WeekCalendar } from './WeekCalendar'
import styles from './Calendar.module.scss'
import clsx from 'clsx'

export function Calendar({ variant = 'month' }: CalendarProps) {
	const startDate = new Date()
	const endDate = new Date()
	endDate.setDate(endDate.getDate() + 7) // Example: set end date to 7 days from start date

	return (
		<div className={clsx(styles.container)}>
			{variant === 'day' && (
				<DayCalendar
					startDate={startDate}
					endDate={endDate}
				/>
			)}
			{variant === 'week' && (
				<WeekCalendar
					startDate={startDate}
					endDate={endDate}
				/>
			)}
			{variant === 'month' && <p>Month Calendar - Coming Soon!</p>}
		</div>
	)
}
