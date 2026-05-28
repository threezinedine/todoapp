import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from './Calendar'
import type { CalendarHandle } from './CalendarProps'
import { Button } from '../button'

const meta: Meta<typeof Calendar> = {
	component: Calendar,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Calendar>

const styles: React.CSSProperties = {
	backgroundColor: '#575757',
	display: 'flex',
	flexDirection: 'column',
	padding: '3rem',
	minWidth: '1vw',
	height: '80vh',
	maxHeight: '80vh',
	overflow: 'hidden',
}

export const DayCalendar: Story = {
	render: () => {
		const ref = useRef<CalendarHandle>(null)
		const [startDate, setStartDate] = useState(new Date())

		return (
			<div style={styles}>
				<div
					style={{
						display: 'flex',
						gap: '1rem',
						marginBottom: '1rem',
					}}
				>
					<Button
						text="Focus"
						onClick={() => {
							ref?.current?.focus()
						}}
					/>
					<Button
						text="Previous period"
						onClick={() => {
							ref?.current?.previousPeriod()
						}}
					/>
					<Button
						text="Next period"
						onClick={() => {
							ref?.current?.nextPeriod()
						}}
					/>
				</div>
				<Calendar
					ref={ref}
					events={[
						{
							id: '1',
							name: 'Meeting with Team',
							startedAt: new Date(
								new Date().getTime() - 120 * 60 * 1000,
							),
							endedAt: new Date(
								new Date().getTime() - 75 * 60 * 1000,
							),
							color: '#8ab0ff',
							gradientColor: '#5a8cff',
							onEventClicked: (event) => {
								alert(`Clicked on event: ${event.name}`)
							},
						},
						{
							id: '2',
							name: 'Meeting with the customer',
							startedAt: new Date(
								new Date().getTime() - 60 * 60 * 1000,
							),
							endedAt: new Date(
								new Date().getTime() - 30 * 60 * 1000,
							),
							color: '#58de94',
							gradientColor: '#3ab678',
							onEventClicked: (event) => {
								alert(`Clicked on event: ${event.name}`)
							},
						},
						{
							id: '3',
							name: 'Design new feature',
							startedAt: new Date(
								new Date().getTime() + 24 * 60 * 60 * 1000,
							),
							endedAt: new Date(
								new Date().getTime() + 25 * 60 * 60 * 1000,
							),
							color: '#ffb86c',
							gradientColor: '#ff9e44',
							onEventClicked: (event) => {
								alert(`Clicked on event: ${event.name}`)
							},
						},
					]}
					variant="day"
					onPreviousPeriod={(newStartDate) => {
						setStartDate(newStartDate)
					}}
					onNextPeriod={(newStartDate) => {
						setStartDate(newStartDate)
					}}
					startDate={startDate}
					endDate={
						new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
					}
				/>
			</div>
		)
	},
}

export const WeekCalendar: Story = {
	render: () => (
		<div style={styles}>
			<Calendar variant="week" />
		</div>
	),
}
