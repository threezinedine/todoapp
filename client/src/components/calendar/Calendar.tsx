import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { CalendarHandle, CalendarProps } from './CalendarProps'
import { DayCalendar } from './DayCalendar'
import { WeekCalendar } from './WeekCalendar'
import styles from './Calendar.module.scss'
import clsx from 'clsx'

export const Calendar = forwardRef<CalendarHandle, CalendarProps>(
	function Calendar(
		{
			variant = 'month',
			events,
			startDate: providedStartDate,
			endDate: providedEndDate,
			onPreviousPeriod,
			onNextPeriod,
		},
		ref,
	) {
		const containerRef = useRef<HTMLDivElement>(null)
		const dayCalendarRef = useRef<CalendarHandle>(null)
		const startDate = providedStartDate ?? new Date()
		const endDate = (() => {
			if (providedEndDate) {
				return providedEndDate
			}

			if (variant === 'week') {
				const weekEndDate = new Date(startDate)
				weekEndDate.setDate(weekEndDate.getDate() + 7)
				return weekEndDate
			}

			return startDate
		})()

		useImperativeHandle(
			ref,
			() => ({
				focus: () => {
					if (variant === 'day') {
						dayCalendarRef.current?.focus()
						return
					}

					containerRef.current?.focus()
				},
				nextPeriod: () => {
					if (variant !== 'day') {
						return
					}

					return dayCalendarRef.current?.nextPeriod()
				},
				previousPeriod: () => {
					if (variant !== 'day') {
						return
					}

					return dayCalendarRef.current?.previousPeriod()
				},
			}),
			[variant],
		)

		return (
			<div
				ref={containerRef}
				tabIndex={-1}
				className={clsx(styles.container)}
			>
				{variant === 'day' && (
					<DayCalendar
						ref={dayCalendarRef}
						startDate={startDate}
						endDate={endDate}
						events={events}
						onPreviousPeriod={onPreviousPeriod}
						onNextPeriod={onNextPeriod}
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
	},
)

Calendar.displayName = 'Calendar'
