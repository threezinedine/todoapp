export interface CalendarEventProps {
	id: string
	name: string
	description?: string
	dueDate?: Date
	startedAt?: Date
	endedAt?: Date
	color?: string
	gradientColor?: string
	onEventClicked?: (
		event: CalendarEventProps,
		index: number,
	) => Promise<void> | void
}

export interface CalendarComponentProps {
	startDate?: Date
	endDate?: Date
	events?: CalendarEventProps[]
}

export interface CalendarProps extends CalendarComponentProps {
	variant?: 'month' | 'week' | 'day'
}

export interface CalendarHandle {
	focus: () => void
}
