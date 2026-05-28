import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { DayCalendar, nextPeriod, previousPeriod } from './DayCalendar'
import type { CalendarEventProps } from './CalendarProps'

vi.mock('./DayCalendar.module.scss', () => ({
	default: {
		container: 'container',
		header: 'header',
		title: 'title',
		dateLabel: 'dateLabel',
		scrollViewport: 'scrollViewport',
		dayView: 'dayView',
		timeRail: 'timeRail',
		timeLabel: 'timeLabel',
		gridArea: 'gridArea',
		hourLine: 'hourLine',
		currentTimeLine: 'currentTimeLine',
		currentTimeDot: 'currentTimeDot',
		eventLayer: 'eventLayer',
		emptyState: 'emptyState',
		eventCard: 'eventCard',
		eventTitle: 'eventTitle',
		eventTime: 'eventTime',
		eventDescription: 'eventDescription',
	},
}))

describe('DayCalendar', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('renders title and formatted date', () => {
		const startDate = new Date(2026, 4, 10, 9, 0)
		render(<DayCalendar startDate={startDate} />)

		expect(screen.getByText('Day')).toBeInTheDocument()
		const expectedDate = new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(startDate)
		expect(screen.getByText(expectedDate)).toBeInTheDocument()
	})

	it('shows empty state when there are no events', () => {
		render(
			<DayCalendar
				startDate={new Date(2026, 4, 10)}
				events={[]}
			/>,
		)

		expect(screen.getByText('No events scheduled.')).toBeInTheDocument()
	})

	it('renders event title and description and hides empty state', () => {
		const events: CalendarEventProps[] = [
			{
				id: 'e1',
				name: 'Design Sync',
				description: 'Review timeline',
				startedAt: new Date(2026, 4, 10, 10, 0),
				endedAt: new Date(2026, 4, 10, 11, 0),
			},
		]

		render(
			<DayCalendar
				startDate={new Date(2026, 4, 10)}
				events={events}
			/>,
		)

		expect(screen.getByText('Design Sync')).toBeInTheDocument()
		expect(screen.getByText('Review timeline')).toBeInTheDocument()
		expect(
			screen.queryByText('No events scheduled.'),
		).not.toBeInTheDocument()
	})

	it('displays time range for events', () => {
		const events: CalendarEventProps[] = [
			{
				id: 'e1',
				name: 'Meeting',
				startedAt: new Date(2026, 4, 10, 10, 0),
				endedAt: new Date(2026, 4, 10, 11, 30),
			},
		]

		render(
			<DayCalendar
				startDate={new Date(2026, 4, 10)}
				events={events}
			/>,
		)

		expect(screen.getByText('10:00 AM - 11:30 AM')).toBeInTheDocument()
	})

	it('filters out events that are not on the selected day', () => {
		const events: CalendarEventProps[] = [
			{
				id: 'today',
				name: 'Today event',
				startedAt: new Date(2026, 4, 10, 9, 0),
				endedAt: new Date(2026, 4, 10, 10, 0),
			},
			{
				id: 'other-day',
				name: 'Another day event',
				startedAt: new Date(2026, 4, 11, 9, 0),
				endedAt: new Date(2026, 4, 11, 10, 0),
			},
		]

		render(
			<DayCalendar
				startDate={new Date(2026, 4, 10)}
				events={events}
			/>,
		)

		expect(screen.getByText('Today event')).toBeInTheDocument()
		expect(screen.queryByText('Another day event')).not.toBeInTheDocument()
	})

	it('positions dueDate-only midnight event at 9 AM default slot', () => {
		const events: CalendarEventProps[] = [
			{
				id: 'due-midnight',
				name: 'Due Item',
				dueDate: new Date(2026, 4, 10, 0, 0),
			},
		]

		render(
			<DayCalendar
				startDate={new Date(2026, 4, 10)}
				events={events}
			/>,
		)

		const eventCard = screen.getByText('Due Item').closest('article')
		expect(eventCard).toBeInTheDocument()
		expect(eventCard).toHaveStyle({ top: '576px', height: '64px' })
	})

	it('uses default one-hour duration when only startedAt is provided', () => {
		const events: CalendarEventProps[] = [
			{
				id: 'start-only',
				name: 'Quick Update',
				startedAt: new Date(2026, 4, 10, 13, 30),
			},
		]

		render(
			<DayCalendar
				startDate={new Date(2026, 4, 10)}
				events={events}
			/>,
		)

		const eventCard = screen.getByText('Quick Update').closest('article')
		expect(eventCard).toBeInTheDocument()
		expect(eventCard).toHaveStyle({ top: '864px', height: '64px' })
	})

	it('splits overlapping events into columns', () => {
		const events: CalendarEventProps[] = [
			{
				id: 'a',
				name: 'Event A',
				startedAt: new Date(2026, 4, 10, 9, 0),
				endedAt: new Date(2026, 4, 10, 10, 0),
			},
			{
				id: 'b',
				name: 'Event B',
				startedAt: new Date(2026, 4, 10, 9, 30),
				endedAt: new Date(2026, 4, 10, 10, 30),
			},
		]

		render(
			<DayCalendar
				startDate={new Date(2026, 4, 10)}
				events={events}
			/>,
		)

		const eventA = screen.getByText('Event A').closest('article')
		const eventB = screen.getByText('Event B').closest('article')

		expect(eventA).toHaveStyle({ width: '49.3%', left: '0%' })
		expect(eventB).toHaveStyle({
			width: '49.3%',
			left: '50.699999999999996%',
		})
	})

	it('shows current-time line only when startDate is today', () => {
		vi.setSystemTime(new Date(2026, 4, 10, 15, 45))

		const { rerender } = render(
			<DayCalendar startDate={new Date(2026, 4, 10)} />,
		)
		expect(document.querySelector('.currentTimeLine')).toBeInTheDocument()

		rerender(<DayCalendar startDate={new Date(2026, 4, 11)} />)
		expect(
			document.querySelector('.currentTimeLine'),
		).not.toBeInTheDocument()
	})

	it('refreshes the current-time marker position on interval', () => {
		vi.setSystemTime(new Date(2026, 4, 10, 10, 0, 0))

		render(<DayCalendar startDate={new Date(2026, 4, 10)} />)

		const currentLine = document.querySelector(
			'.currentTimeLine',
		) as HTMLDivElement
		expect(currentLine).toBeInTheDocument()

		const initialTop = parseFloat(currentLine.style.top)
		expect(initialTop).toBeCloseTo(640, 3)

		vi.setSystemTime(new Date(2026, 4, 10, 10, 5, 0))
		act(() => {
			vi.advanceTimersByTime(5000)
		})

		const updatedTop = parseFloat(currentLine.style.top)
		expect(updatedTop).toBeGreaterThan(initialTop)
		expect(updatedTop).toBeCloseTo(645.333, 2)
	})

	it('computes nextPeriod for day calendar', () => {
		const startDate = new Date(2026, 4, 10, 9, 30)
		const endDate = new Date(2026, 4, 10, 23, 59)

		const { newStartDate, newEndDate } = nextPeriod(startDate, endDate)

		expect(newStartDate).toEqual(new Date(2026, 4, 11, 9, 30))
		expect(newEndDate).toEqual(new Date(2026, 4, 11, 23, 59))
	})

	it('computes previousPeriod for day calendar', () => {
		const startDate = new Date(2026, 4, 10, 9, 30)
		const endDate = new Date(2026, 4, 10, 23, 59)

		const { newStartDate, newEndDate } = previousPeriod(startDate, endDate)

		expect(newStartDate).toEqual(new Date(2026, 4, 9, 9, 30))
		expect(newEndDate).toEqual(new Date(2026, 4, 9, 23, 59))
	})
})
