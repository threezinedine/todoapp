import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ViewSwitch } from './ViewSwitch'

vi.mock('./ViewSwitch.module.scss', () => ({
	default: {
		wrapper: 'wrapper',
		viewButton: 'viewButton',
		activeButton: 'activeButton',
		indicator: 'indicator',
		'day-active': 'day-active',
		'week-active': 'week-active',
		'month-active': 'month-active',
	},
}))

describe('ViewSwitch', () => {
	it('renders day, week, and month buttons', () => {
		render(<ViewSwitch onViewChange={vi.fn()} />)

		expect(screen.getByText('Day')).toBeInTheDocument()
		expect(screen.getByText('Week')).toBeInTheDocument()
		expect(screen.getByText('Month')).toBeInTheDocument()
	})

	it('uses day as default active view', () => {
		const { container } = render(<ViewSwitch onViewChange={vi.fn()} />)

		expect(screen.getByText('Day')).toHaveClass('activeButton')
		expect(screen.getByText('Week')).not.toHaveClass('activeButton')
		expect(screen.getByText('Month')).not.toHaveClass('activeButton')

		const indicator = container.querySelector('.indicator')
		expect(indicator).toHaveClass('day-active')
		expect(indicator).not.toHaveClass('week-active')
		expect(indicator).not.toHaveClass('month-active')
	})

	it('respects provided defaultView', () => {
		const { container } = render(
			<ViewSwitch
				defaultView="week"
				onViewChange={vi.fn()}
			/>,
		)

		expect(screen.getByText('Week')).toHaveClass('activeButton')
		expect(screen.getByText('Day')).not.toHaveClass('activeButton')
		expect(screen.getByText('Month')).not.toHaveClass('activeButton')

		const indicator = container.querySelector('.indicator')
		expect(indicator).toHaveClass('week-active')
		expect(indicator).not.toHaveClass('day-active')
		expect(indicator).not.toHaveClass('month-active')
	})

	it('changes active view and emits callback on click', () => {
		const onViewChange = vi.fn()
		const { container } = render(<ViewSwitch onViewChange={onViewChange} />)

		fireEvent.click(screen.getByText('Month'))

		expect(onViewChange).toHaveBeenCalledTimes(1)
		expect(onViewChange).toHaveBeenCalledWith('month')
		expect(screen.getByText('Month')).toHaveClass('activeButton')
		expect(screen.getByText('Day')).not.toHaveClass('activeButton')

		const indicator = container.querySelector('.indicator')
		expect(indicator).toHaveClass('month-active')
	})

	it('supports switching multiple times', () => {
		const onViewChange = vi.fn()
		render(<ViewSwitch onViewChange={onViewChange} />)

		fireEvent.click(screen.getByText('Week'))
		fireEvent.click(screen.getByText('Month'))
		fireEvent.click(screen.getByText('Day'))

		expect(onViewChange).toHaveBeenNthCalledWith(1, 'week')
		expect(onViewChange).toHaveBeenNthCalledWith(2, 'month')
		expect(onViewChange).toHaveBeenNthCalledWith(3, 'day')
		expect(screen.getByText('Day')).toHaveClass('activeButton')
	})
})
