import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ViewSwitch } from './ViewSwitch'

const meta: Meta<typeof ViewSwitch> = {
	title: 'State Components/View Switch',
	component: ViewSwitch,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ViewSwitch>

const calendarOptions = [
	{ value: 'day', label: 'Day' },
	{ value: 'week', label: 'Week' },
	{ value: 'month', label: 'Month' },
] as const

const pomodoroOptions = [
	{ value: 'work', label: 'Working Time' },
	{ value: 'shortBreak', label: 'Short Break' },
	{ value: 'longBreak', label: 'Long Break' },
] as const

export const CalendarLikeDefault: Story = {
	render: () => (
		<div style={{ backgroundColor: '#202020', padding: '16px' }}>
			<ViewSwitch
				defaultValue="day"
				options={[...calendarOptions]}
				onValueChange={(value) => {
					alert(`View changed to: ${value}`)
				}}
			/>
		</div>
	),
}

export const PomodoroControlled: Story = {
	render: () => {
		const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>(
			'work',
		)

		return (
			<div
				style={{
					backgroundColor: '#202020',
					padding: '16px',
					display: 'grid',
					gap: '12px',
				}}
			>
				<ViewSwitch
					value={mode}
					options={[...pomodoroOptions]}
					onValueChange={setMode}
				/>
				<div style={{ color: '#f1f1f1', fontWeight: 600 }}>
					Active mode: {mode}
				</div>
			</div>
		)
	},
}
