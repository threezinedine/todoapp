export interface CalendarEventProps {
	id: string
	name: string
	description?: string
	dueDate?: Date
	startedAt?: Date
	endedAt?: Date
}

export interface CalendarComponentProps {
	startDate?: Date
	endDate?: Date
	events?: CalendarEventProps[]
}

export interface CalendarProps {
	variant?: 'month' | 'week' | 'day'
}
