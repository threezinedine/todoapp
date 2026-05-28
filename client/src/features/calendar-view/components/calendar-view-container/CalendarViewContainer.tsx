import { Button, Calendar, type CalendarHandle } from '~/components'
import { ViewSwitch } from '~/state-components'
import styles from './CalendarViewContainer.module.scss'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import { useTasksStore } from '~/features/tasks'

const CALENDAR_VIEW_OPTIONS = [
	{ value: 'day', label: 'Day' },
	{ value: 'week', label: 'Week' },
	{ value: 'month', label: 'Month' },
] as const

export function CalendarViewContainer() {
	const calendarRef = useRef<CalendarHandle>(null)
	const { fetchTasks, currentDate } = useTasksStore()
	const [variant, _] =
		useState<(typeof CALENDAR_VIEW_OPTIONS)[number]['value']>('day')

	return (
		<div className={clsx(styles.wrapper)}>
			<div className={clsx(styles.viewSwitchWrapper)}>
				<div className={clsx(styles.navigationButtons)}>
					<Button
						text="Previous"
						variant="glick-black"
						onClick={() => {
							calendarRef?.current?.previousPeriod()
						}}
						dataTestId="previous-period-button"
					/>
					<Button
						text="Next"
						variant="glick-black"
						onClick={() => {
							calendarRef?.current?.nextPeriod()
						}}
						dataTestId="next-period-button"
					/>
				</div>
				<ViewSwitch
					defaultValue="day"
					options={[...CALENDAR_VIEW_OPTIONS]}
					onValueChange={(view) => {
						console.log(`Switched to ${view} view`)
					}}
				/>
			</div>
			<div className={clsx(styles.calendarWrapper)}>
				<Calendar
					onNextPeriod={(date) => {
						if (variant === 'day') {
							fetchTasks(date)
						}
					}}
					onPreviousPeriod={(date) => {
						if (variant === 'day') {
							fetchTasks(date)
						}
					}}
					startDate={currentDate}
					ref={calendarRef}
					variant={variant}
					events={[
						{
							id: '1',
							name: 'Morning Meeting',
							startedAt: new Date(
								new Date().getTime() - 75 * 60 * 1000,
							),
							endedAt: new Date(
								new Date().getTime() - 45 * 60 * 1000,
							),
							color: '#8ab0ff',
							gradientColor: '#5a8cff',
							onEventClicked: (event) => {
								alert(`Clicked on event: ${event.name}`)
							},
						},
						{
							id: '2',
							name: 'Lunch with Team',
							startedAt: new Date(
								new Date().getTime() + 60 * 60 * 1000,
							),
							endedAt: new Date(
								new Date().getTime() + 120 * 60 * 1000,
							),
							color: '#58de94',
							gradientColor: '#3ab678',
							onEventClicked: (event) => {
								alert(`Clicked on event: ${event.name}`)
							},
						},
					]}
				/>
			</div>
		</div>
	)
}
