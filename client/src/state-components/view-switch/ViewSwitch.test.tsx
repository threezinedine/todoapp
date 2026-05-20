import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ViewSwitch } from './ViewSwitch'

vi.mock('./ViewSwitch.module.scss', () => ({
	default: {
		wrapper: 'wrapper',
		viewButton: 'viewButton',
		activeButton: 'activeButton',
		indicator: 'indicator',
	},
}))

describe('ViewSwitch', () => {
	const calendarOptions = [
		{ value: 'day', label: 'Day' },
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' },
	] as const

	it('renders all provided options', () => {
		render(<ViewSwitch options={[...calendarOptions]} />)

		expect(screen.getByText('Day')).toBeInTheDocument()
		expect(screen.getByText('Week')).toBeInTheDocument()
		expect(screen.getByText('Month')).toBeInTheDocument()
	})

	it('uses first option as active by default', () => {
		render(<ViewSwitch options={[...calendarOptions]} />)

		expect(screen.getByText('Day')).toHaveClass('activeButton')
		expect(screen.getByText('Week')).not.toHaveClass('activeButton')
		expect(screen.getByText('Month')).not.toHaveClass('activeButton')
	})

	it('respects defaultValue in uncontrolled mode', () => {
		render(
			<ViewSwitch
				options={[...calendarOptions]}
				defaultValue="week"
			/>,
		)

		expect(screen.getByText('Week')).toHaveClass('activeButton')
		expect(screen.getByText('Day')).not.toHaveClass('activeButton')
	})

	it('updates active value and emits callback on click in uncontrolled mode', () => {
		const onValueChange = vi.fn()
		render(
			<ViewSwitch
				options={[...calendarOptions]}
				onValueChange={onValueChange}
			/>,
		)

		fireEvent.click(screen.getByText('Month'))

		expect(onValueChange).toHaveBeenCalledTimes(1)
		expect(onValueChange).toHaveBeenCalledWith('month')
		expect(screen.getByText('Month')).toHaveClass('activeButton')
		expect(screen.getByText('Day')).not.toHaveClass('activeButton')
	})

	it('does not update active value internally in controlled mode', () => {
		const onValueChange = vi.fn()
		render(
			<ViewSwitch
				options={[...calendarOptions]}
				value="day"
				onValueChange={onValueChange}
			/>,
		)

		fireEvent.click(screen.getByText('Month'))

		expect(onValueChange).toHaveBeenCalledWith('month')
		expect(screen.getByText('Day')).toHaveClass('activeButton')
		expect(screen.getByText('Month')).not.toHaveClass('activeButton')
	})

	it('reflects external value changes in controlled mode', () => {
		const { rerender } = render(
			<ViewSwitch
				options={[...calendarOptions]}
				value="day"
			/>,
		)

		expect(screen.getByText('Day')).toHaveClass('activeButton')

		rerender(
			<ViewSwitch
				options={[...calendarOptions]}
				value="week"
			/>,
		)

		expect(screen.getByText('Week')).toHaveClass('activeButton')
		expect(screen.getByText('Day')).not.toHaveClass('activeButton')
	})

	it('renders nothing when options are empty', () => {
		const { container } = render(<ViewSwitch options={[]} />)

		expect(container.firstChild).toBeNull()
	})
})
