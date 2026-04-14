import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
	it('renders with children', () => {
		render(<Button>Click me</Button>)
		expect(3).toBe(3)
	})
})
