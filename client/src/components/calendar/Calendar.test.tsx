import { createRef, forwardRef, useImperativeHandle } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Calendar } from './Calendar'
import type { CalendarHandle } from './CalendarProps'

const dayFocusSpy = vi.fn()
const dayNextPeriodSpy = vi.fn()
const dayPreviousPeriodSpy = vi.fn()

vi.mock('./Calendar.module.scss', () => ({
	default: {
		container: 'container',
	},
}))

vi.mock('./DayCalendar', () => ({
	DayCalendar: forwardRef<CalendarHandle>(function DayCalendarMock(_, ref) {
		useImperativeHandle(ref, () => ({
			focus: dayFocusSpy,
			nextPeriod: dayNextPeriodSpy,
			previousPeriod: dayPreviousPeriodSpy,
		}))

		return <div data-testid="day-calendar">Day View</div>
	}),
}))

vi.mock('./WeekCalendar', () => ({
	WeekCalendar: () => <div data-testid="week-calendar">Week View</div>,
}))

describe('Calendar', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders month placeholder by default', () => {
		render(<Calendar />)

		expect(
			screen.getByText('Month Calendar - Coming Soon!'),
		).toBeInTheDocument()
	})

	it('renders day calendar variant', () => {
		render(<Calendar variant="day" />)

		expect(screen.getByTestId('day-calendar')).toBeInTheDocument()
		expect(screen.queryByTestId('week-calendar')).not.toBeInTheDocument()
	})

	it('renders week calendar variant', () => {
		render(<Calendar variant="week" />)

		expect(screen.getByTestId('week-calendar')).toBeInTheDocument()
		expect(screen.queryByTestId('day-calendar')).not.toBeInTheDocument()
	})

	it('exposes a public focus() method through ref', () => {
		const ref = createRef<CalendarHandle>()
		render(<Calendar ref={ref} />)

		const container = document.querySelector('.container') as HTMLDivElement
		expect(container).toBeInTheDocument()
		expect(container).toHaveAttribute('tabindex', '-1')
		expect(ref.current).not.toBeNull()
		expect(typeof ref.current?.focus).toBe('function')
		expect(typeof ref.current?.nextPeriod).toBe('function')
		expect(typeof ref.current?.previousPeriod).toBe('function')
	})

	it('delegates focus() to DayCalendar when variant is day', () => {
		const ref = createRef<CalendarHandle>()
		render(
			<Calendar
				ref={ref}
				variant="day"
			/>,
		)

		ref.current?.focus()

		expect(dayFocusSpy).toHaveBeenCalledTimes(1)
	})

	it('delegates nextPeriod() to DayCalendar when variant is day', () => {
		const ref = createRef<CalendarHandle>()
		render(
			<Calendar
				ref={ref}
				variant="day"
			/>,
		)

		ref.current?.nextPeriod()

		expect(dayNextPeriodSpy).toHaveBeenCalledTimes(1)
	})

	it('delegates previousPeriod() to DayCalendar when variant is day', () => {
		const ref = createRef<CalendarHandle>()
		render(
			<Calendar
				ref={ref}
				variant="day"
			/>,
		)

		ref.current?.previousPeriod()

		expect(dayPreviousPeriodSpy).toHaveBeenCalledTimes(1)
	})

	it('ref methods do not delegate to DayCalendar when variant is not day', () => {
		const ref = createRef<CalendarHandle>()
		render(
			<Calendar
				ref={ref}
				variant="week"
			/>,
		)

		expect(() => ref.current?.focus()).not.toThrow()
		expect(() => ref.current?.nextPeriod()).not.toThrow()
		expect(() => ref.current?.previousPeriod()).not.toThrow()

		expect(dayFocusSpy).not.toHaveBeenCalled()
		expect(dayNextPeriodSpy).not.toHaveBeenCalled()
		expect(dayPreviousPeriodSpy).not.toHaveBeenCalled()
	})
})
