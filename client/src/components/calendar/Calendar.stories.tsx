import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from './Calendar'

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
	render: () => (
		<div style={styles}>
			<Calendar variant="day" />
		</div>
	),
}

export const WeekCalendar: Story = {
	render: () => (
		<div style={styles}>
			<Calendar variant="week" />
		</div>
	),
}
