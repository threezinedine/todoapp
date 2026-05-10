import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

// Mock the SCSS module so class names are predictable in jsdom
vi.mock('./Input.module.scss', () => ({
	default: {
		container: 'container',
		input: 'input',
		label: 'label',
		dateContainer: 'dateContainer',
		dateInput: 'dateInput',
		dateLabel: 'dateLabel',
		textarea: 'textarea',
	},
}))

describe('Input', () => {
	// ─── Rendering ───────────────────────────────────────────────────────────────

	it('renders with default props', () => {
		render(<Input />)

		expect(screen.getByText('Field')).toBeInTheDocument()
		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('renders with a custom field label', () => {
		render(<Input field="Username" />)

		expect(screen.getByText('Username')).toBeInTheDocument()
	})

	it('renders the input with the provided value', () => {
		render(<Input value="test@example.com" />)

		expect(screen.getByRole('textbox')).toHaveValue('test@example.com')
	})

	it('renders the input with a placeholder (empty string by default)', () => {
		render(<Input />)

		expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '')
	})

	it('renders the label with data-text attribute matching the field prop', () => {
		render(<Input field="Email" />)

		const label = screen.getByText('Email')
		expect(label).toHaveAttribute('data-text', 'Email')
	})

	it('renders multiple children correctly', () => {
		render(<Input field="Search" />)

		const label = screen.getByText('Search')
		const input = screen.getByRole('textbox')

		expect(label).toBeInTheDocument()
		expect(input).toBeInTheDocument()
	})

	// ─── onChange callback ───────────────────────────────────────────────────────

	it('calls onChange when typing into the input', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()

		render(<Input onChange={onChange} />)

		const input = screen.getByRole('textbox')
		await user.type(input, 'hello')

		expect(onChange).toHaveBeenCalled()
	})

	it('does not call onChange when input is changed but onChange is not provided', async () => {
		const user = userEvent.setup()

		render(<Input />)

		const input = screen.getByRole('textbox')
		// Should not throw
		await user.type(input, 'hello')

		expect(input).toHaveValue('hello')
	})

	// ─── type variants ───────────────────────────────────────────────────────────

	it('renders input with type "text" by default', () => {
		render(<Input />)

		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
	})

	it('renders input with type "password"', () => {
		render(<Input type="password" />)

		// jsdom hides the "textbox" role for type="password" inputs
		const input = document.querySelector('input[type="password"]')
		expect(input).toBeInTheDocument()
	})

	it('renders input with type "email"', () => {
		render(<Input type="email" />)

		expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
	})

	it('renders input with type "number"', () => {
		render(<Input type="number" />)

		// type="number" gives role="spinbutton" in jsdom
		expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
	})

	// ─── Structural / class names ─────────────────────────────────────────────

	it('renders the container div with the container class name', () => {
		render(<Input />)

		expect(document.querySelector('.container')).toBeInTheDocument()
	})

	it('renders the input with the input class name', () => {
		render(<Input />)

		expect(document.querySelector('.input')).toBeInTheDocument()
	})

	it('renders the label with the label class name', () => {
		render(<Input />)

		expect(document.querySelector('.label')).toBeInTheDocument()
	})

	// ─── Open / close transitions ───────────────────────────────────────────────
	// (N/A for Input — stateless display-only component)

	// ─── Edge cases ─────────────────────────────────────────────────────────────

	it('renders with empty string as field without crashing', () => {
		render(<Input field="" />)

		// Label renders with empty text, input is still present
		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('renders with undefined value without crashing', () => {
		render(<Input value={undefined} />)

		expect(screen.getByRole('textbox')).toHaveValue('')
	})

	it('renders with all type variants without crashing', () => {
		const types: Array<'text' | 'password' | 'email' | 'number'> = [
			'text',
			'password',
			'email',
			'number',
		]

		types.forEach((type) => {
			const { unmount } = render(<Input type={type} />)
			// Use a flexible selector since role depends on the input type
			const input = document.querySelector(`input[type="${type}"]`)
			expect(input).toBeInTheDocument()
			unmount()
		})
	})

	describe('date input', () => {
		it('renders date input with date-specific classes', () => {
			render(
				<Input
					type="date"
					field="Due Date"
				/>,
			)

			const dateInput = document.querySelector('input[type="date"]')
			const dateContainer = document.querySelector('.dateContainer')
			const dateLabel = document.querySelector('.dateLabel')

			expect(dateContainer).toBeInTheDocument()
			expect(dateInput).toBeInTheDocument()
			expect(dateInput).toHaveClass('input')
			expect(dateInput).toHaveClass('dateInput')
			expect(dateLabel).toBeInTheDocument()
			expect(dateLabel).toHaveTextContent('Due Date')
		})

		it('renders date input with provided value', () => {
			render(
				<Input
					type="date"
					value="2026-05-10"
				/>,
			)

			const dateInput = document.querySelector('input[type="date"]')
			expect(dateInput).toHaveValue('2026-05-10')
		})

		it('sets date label data-text from field prop', () => {
			render(
				<Input
					type="date"
					field="Deadline"
				/>,
			)

			const label = screen.getByText('Deadline')
			expect(label).toHaveAttribute('data-text', 'Deadline')
		})

		it('passes data-testid to date input', () => {
			render(
				<Input
					type="date"
					dataTestId="due-date-input"
				/>,
			)

			expect(screen.getByTestId('due-date-input')).toHaveAttribute(
				'type',
				'date',
			)
		})

		it('uses field as date input name attribute', () => {
			render(
				<Input
					type="date"
					field="dueDate"
				/>,
			)

			const dateInput = document.querySelector('input[type="date"]')
			expect(dateInput).toHaveAttribute('name', 'dueDate')
		})

		it('calls onChange when date value changes', () => {
			const onChange = vi.fn()
			render(
				<Input
					type="date"
					onChange={onChange}
				/>,
			)

			const dateInput = document.querySelector('input[type="date"]')
			expect(dateInput).toBeInTheDocument()

			fireEvent.change(dateInput as HTMLInputElement, {
				target: { value: '2026-12-24' },
			})

			expect(onChange).toHaveBeenCalledTimes(1)
			expect(onChange).toHaveBeenCalledWith(
				expect.objectContaining({
					target: expect.objectContaining({ value: '2026-12-24' }),
				}),
			)
		})

		it('updates date value without onChange handler in uncontrolled mode', () => {
			render(<Input type="date" />)

			const dateInput = document.querySelector(
				'input[type="date"]',
			) as HTMLInputElement
			fireEvent.change(dateInput, { target: { value: '2026-01-31' } })

			expect(dateInput).toHaveValue('2026-01-31')
		})

		it('does not render textarea for date type', () => {
			render(<Input type="date" />)

			expect(document.querySelector('textarea')).not.toBeInTheDocument()
		})
	})
})
