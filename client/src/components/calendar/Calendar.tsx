import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { CalendarHandle, CalendarProps } from './CalendarProps'
import { DayCalendar } from './DayCalendar'
import { WeekCalendar } from './WeekCalendar'
import styles from './Calendar.module.scss'
import clsx from 'clsx'

const DAY_VIEWPORT_SELECTOR = '[data-calendar-day-viewport]'
const CURRENT_TIME_MARKER_SELECTOR = '[data-calendar-current-time-marker]'

export const Calendar = forwardRef<CalendarHandle, CalendarProps>(
	function Calendar({ variant = 'month' }, ref) {
		const containerRef = useRef<HTMLDivElement>(null)
		const startDate = new Date()
		const endDate = new Date()
		endDate.setDate(endDate.getDate() + 7) // Example: set end date to 7 days from start date

		useImperativeHandle(
			ref,
			() => ({
				focus: () => {
					containerRef.current?.focus()

					if (variant !== 'day' || !containerRef.current) {
						return
					}

					const viewport =
						containerRef.current.querySelector<HTMLElement>(
							DAY_VIEWPORT_SELECTOR,
						)
					const currentTimeMarker =
						containerRef.current.querySelector<HTMLElement>(
							CURRENT_TIME_MARKER_SELECTOR,
						)

					if (!viewport || !currentTimeMarker) {
						return
					}

					const centeredTop = Math.max(
						0,
						currentTimeMarker.offsetTop - viewport.clientHeight / 2,
					)

					if (typeof viewport.scrollTo === 'function') {
						viewport.scrollTo({
							top: centeredTop,
							behavior: 'smooth',
						})
						return
					}

					viewport.scrollTop = centeredTop
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
	},
)

Calendar.displayName = 'Calendar'
