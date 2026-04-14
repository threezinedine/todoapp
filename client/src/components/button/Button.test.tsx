import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
	it('call the onClick function when clicked', () => {
		const onClick = vi.fn()
		const { getByText } = render(
			<Button
				text="Click me"
				onClick={onClick}
			/>,
		)

		const button = getByText('Click me')
		button.click()

		expect(onClick).toHaveBeenCalled()
	})
})
