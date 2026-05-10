import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Calendar } from './Calendar'
import type { CalendarHandle } from './CalendarProps'

vi.mock('./Calendar.module.scss', () => ({
	default: {
		container: 'container',
	},
}))

vi.mock('./DayCalendar', () => ({
	DayCalendar: () => (
		<div data-testid="day-calendar">
			<div data-calendar-day-viewport>
				<div data-calendar-current-time-marker>Now marker</div>
			</div>
			Day View
		</div>
	),
}))

vi.mock('./WeekCalendar', () => ({
	WeekCalendar: () => <div data-testid="week-calendar">Week View</div>,
}))

describe('Calendar', () => {
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

		ref.current?.focus()

		expect(document.activeElement).toBe(container)
	})

	it('focus() scrolls to current time for day variant', () => {
		const ref = createRef<CalendarHandle>()
		render(
			<Calendar
				ref={ref}
				variant="day"
			/>,
		)

		const viewport = document.querySelector(
			'[data-calendar-day-viewport]',
		) as HTMLElement
		const marker = document.querySelector(
			'[data-calendar-current-time-marker]',
		) as HTMLElement

		expect(viewport).toBeInTheDocument()
		expect(marker).toBeInTheDocument()

		Object.defineProperty(viewport, 'clientHeight', {
			value: 400,
			configurable: true,
		})
		Object.defineProperty(marker, 'offsetTop', {
			value: 900,
			configurable: true,
		})

		const scrollToSpy = vi.fn()
		Object.defineProperty(viewport, 'scrollTo', {
			value: scrollToSpy,
			configurable: true,
		})

		ref.current?.focus()

		expect(scrollToSpy).toHaveBeenCalledWith({
			top: 700,
			behavior: 'smooth',
		})
	})

	it('focus() does not try to scroll when variant is not day', () => {
		const ref = createRef<CalendarHandle>()
		render(
			<Calendar
				ref={ref}
				variant="week"
			/>,
		)

		const viewport = document.querySelector(
			'[data-calendar-day-viewport]',
		) as HTMLElement | null

		expect(viewport).toBeNull()
		expect(() => ref.current?.focus()).not.toThrow()
	})
})
