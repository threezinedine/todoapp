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
	onPreviousPeriod?: (
		newStartDate: Date,
		newEndDate: Date,
	) => Promise<void> | void
	onNextPeriod?: (
		newStartDate: Date,
		newEndDate: Date,
	) => Promise<void> | void
}

export interface CalendarProps extends CalendarComponentProps {
	variant?: 'month' | 'week' | 'day'
}

export interface CalendarHandle {
	focus: () => void
	nextPeriod: () => Promise<void> | void
	previousPeriod: () => Promise<void> | void
}
