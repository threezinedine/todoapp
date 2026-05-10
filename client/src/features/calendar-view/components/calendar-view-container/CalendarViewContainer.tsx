import { Calendar, type CalendarHandle } from '~/components'
import { ViewSwitch } from '../view-switch'
import styles from './CalendarViewContainer.module.scss'
import { useRef } from 'react'
import clsx from 'clsx'

export function CalendarViewContainer() {
	const calendarRef = useRef<CalendarHandle>(null)

	return (
		<div className={clsx(styles.wrapper)}>
			<ViewSwitch
				defaultView="day"
				onViewChange={(view) => {
					console.log(`Switched to ${view} view`)
				}}
			/>
			<div className={clsx(styles.calendarWrapper)}>
				<Calendar
					ref={calendarRef}
					variant="day"
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
