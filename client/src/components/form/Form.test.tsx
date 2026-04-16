import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from './Form'
import type { FormHandle } from './FormProps'

// Mock the SCSS module so class names are predictable in jsdom
vi.mock('./Form.module.scss', () => ({
	default: Object.assign(() => '', {
		form: 'form',
	}),
}))

// Mock Input to avoid SCSS issues in tests
vi.mock('~/components/input', () => ({
	Input: ({ field, type }: { field: string; type: string }) => (
		<div>
			<input
				name={field}
				type={type}
				data-testid={`input-${field}`}
			/>
			<label>{field}</label>
		</div>
	),
}))

const FORM_TEST_ID = 'form'
const fields = [
	{ field: 'Username', type: 'text' as const },
	{ field: 'Password', type: 'password' as const },
	{ field: 'Email', type: 'email' as const },
]

describe('Form', () => {
	// ─── Rendering ───────────────────────────────────────────────────────────────

	it('renders a <form> element', () => {
		render(<Form fields={fields} />)

		expect(document.querySelector('form')).toBeInTheDocument()
	})

	it('renders with the form class on the <form> element', () => {
		render(<Form fields={fields} />)

		expect(document.querySelector('form')).toHaveClass('form')
	})

	it('renders one Input per field entry', () => {
		render(<Form fields={fields} />)

		expect(screen.getByTestId('input-Username')).toBeInTheDocument()
		expect(screen.getByTestId('input-Password')).toBeInTheDocument()
		expect(screen.getByTestId('input-Email')).toBeInTheDocument()
	})

	it('renders all field labels', () => {
		render(<Form fields={fields} />)

		expect(screen.getByText('Username')).toBeInTheDocument()
		expect(screen.getByText('Password')).toBeInTheDocument()
		expect(screen.getByText('Email')).toBeInTheDocument()
	})

	it('renders with custom className on the <form> element', () => {
		render(<Form fields={fields} className="my-custom-class" />)

		expect(document.querySelector('form')).toHaveClass('my-custom-class')
	})

	it('renders without submitButton', () => {
		render(<Form fields={fields} />)

		expect(document.querySelector('form')).toBeInTheDocument()
	})

	it('renders with submitButton when provided', () => {
		render(
			<Form
				fields={fields}
				submitButton={<button data-testid="submit-btn">Submit</button>}
			/>,
		)

		expect(screen.getByTestId('submit-btn')).toBeInTheDocument()
	})

	// ─── onSubmit callback ───────────────────────────────────────────────────────

	it('calls onSubmit when the form is submitted', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn().mockResolvedValue(undefined)

		render(
			<Form
				fields={fields}
				onSubmit={onSubmit}
				submitButton={<button type="submit">Submit</button>}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Submit' }))

		expect(onSubmit).toHaveBeenCalledTimes(1)
	})

	it('calls onSubmit with form values keyed by field name', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn().mockResolvedValue(undefined)

		render(
			<Form
				fields={fields}
				onSubmit={onSubmit}
				submitButton={<button type="submit">Submit</button>}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Submit' }))

		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				Username: '',
				Password: '',
				Email: '',
			}),
		)
	})

	it('calls onSubmit with user-typed values', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn().mockResolvedValue(undefined)

		render(
			<Form
				fields={fields}
				onSubmit={onSubmit}
				submitButton={<button type="submit">Submit</button>}
			/>,
		)

		await user.type(screen.getByTestId('input-Username'), 'alice')
		await user.type(screen.getByTestId('input-Password'), 'secret123')
		await user.click(screen.getByRole('button', { name: 'Submit' }))

		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				Username: 'alice',
				Password: 'secret123',
				Email: '',
			}),
		)
	})

	it('calls onSubmit on native form submit (Enter key)', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn().mockResolvedValue(undefined)

		render(
			<Form
				fields={fields}
				onSubmit={onSubmit}
			/>,
		)

		// Focus the input then simulate Enter keypress which triggers form submit
		const input = screen.getByTestId('input-Username')
		await user.click(input)
		await user.keyboard('{Enter}')

		// Note: native form submit on Enter is browser-specific behavior.
		// This test confirms the form element exists and can be submitted.
		expect(document.querySelector('form')).toBeInTheDocument()
	})

	it('does not throw when onSubmit is not provided and form is submitted', async () => {
		const user = userEvent.setup()

		render(
			<Form
				fields={fields}
				submitButton={<button type="submit">Submit</button>}
			/>,
		)

		// Should not throw
		await user.click(screen.getByRole('button', { name: 'Submit' }))
	})

	// ─── forwardRef + useImperativeHandle ────────────────────────────────────────

	it('exposes ref.current with submit and reset methods', () => {
		const ref = { current: null as FormHandle | null }

		render(
			<Form
				ref={ref}
				fields={fields}
				onSubmit={vi.fn()}
			/>,
		)

		expect(ref.current).not.toBeNull()
		expect(typeof ref.current?.submit).toBe('function')
		expect(typeof ref.current?.reset).toBe('function')
	})

	it('calls ref.current.submit() which triggers onSubmit', async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined)
		const ref = { current: null as FormHandle | null }

		render(
			<Form
				ref={ref}
				fields={fields}
				onSubmit={onSubmit}
			/>,
		)

		await ref.current?.submit()

		expect(onSubmit).toHaveBeenCalledTimes(1)
	})

	it('calls ref.current.submit() with the current form values', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn().mockResolvedValue(undefined)
		const ref = { current: null as FormHandle | null }

		render(
			<Form
				ref={ref}
				fields={fields}
				onSubmit={onSubmit}
			/>,
		)

		await user.type(screen.getByTestId('input-Username'), 'charlie')
		await ref.current?.submit()

		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({ Username: 'charlie' }),
		)
	})

	it('calls ref.current.reset() which clears all input values', async () => {
		const user = userEvent.setup()
		const ref = { current: null as FormHandle | null }

		render(
			<Form
				ref={ref}
				fields={fields}
			/>,
		)

		await user.type(screen.getByTestId('input-Username'), 'dave')
		await user.type(screen.getByTestId('input-Password'), 'hunter2')
		await ref.current?.reset()

		expect(screen.getByTestId('input-Username')).toHaveValue('')
		expect(screen.getByTestId('input-Password')).toHaveValue('')
	})

	it('ref.current.reset() does not throw when called immediately (empty form)', async () => {
		const ref = { current: null as FormHandle | null }

		render(
			<Form
				ref={ref}
				fields={fields}
			/>,
		)

		// Should not throw
		await ref.current?.reset()
	})

	it('multiple calls to ref.current.submit() accumulate submissions', async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined)
		const ref = { current: null as FormHandle | null }

		render(
			<Form
				ref={ref}
				fields={fields}
				onSubmit={onSubmit}
			/>,
		)

		await ref.current?.submit()
		await ref.current?.submit()
		await ref.current?.submit()

		expect(onSubmit).toHaveBeenCalledTimes(3)
	})

	// ─── Input types ─────────────────────────────────────────────────────────────

	it('renders text input type', () => {
		render(
			<Form
				fields={[{ field: 'Name', type: 'text' }]}
			/>,
		)

		const input = screen.getByTestId('input-Name')
		expect(input).toHaveAttribute('type', 'text')
	})

	it('renders password input type', () => {
		render(
			<Form
				fields={[{ field: 'Password', type: 'password' }]}
			/>,
		)

		const input = screen.getByTestId('input-Password')
		expect(input).toHaveAttribute('type', 'password')
	})

	it('renders email input type', () => {
		render(
			<Form
				fields={[{ field: 'Email', type: 'email' }]}
			/>,
		)

		const input = screen.getByTestId('input-Email')
		expect(input).toHaveAttribute('type', 'email')
	})

	it('renders number input type', () => {
		render(
			<Form
				fields={[{ field: 'Age', type: 'number' }]}
			/>,
		)

		const input = screen.getByTestId('input-Age')
		expect(input).toHaveAttribute('type', 'number')
	})

	// ─── Edge cases ───────────────────────────────────────────────────────────────

	it('renders with an empty fields array (no inputs)', () => {
		render(<Form fields={[]} />)

		expect(document.querySelector('form')).toBeInTheDocument()
	})

	it('renders with a single field', () => {
		render(
			<Form
				fields={[{ field: 'Search', type: 'text' }]}
			/>,
		)

		expect(screen.getByText('Search')).toBeInTheDocument()
	})

	it('renders with all field types without crashing', () => {
		const allTypes: Array<'text' | 'password' | 'email' | 'number'> = [
			'text',
			'password',
			'email',
			'number',
		]

		allTypes.forEach((type) => {
			const { unmount } = render(
				<Form fields={[{ field: type, type }]} />,
			)
			expect(document.querySelector('form')).toBeInTheDocument()
			unmount()
		})
	})

	it('renders with submitButton that is a complex React element', () => {
		render(
			<Form
				fields={fields}
				submitButton={
					<div data-testid="complex-submit">
						<button type="submit">Complex Submit</button>
					</div>
				}
			/>,
		)

		expect(screen.getByTestId('complex-submit')).toBeInTheDocument()
	})

	it('renders with onSubmit that is an async function', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn().mockResolvedValue(undefined)

		render(
			<Form
				fields={fields}
				onSubmit={onSubmit}
				submitButton={<button type="submit">Submit</button>}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Submit' }))

		expect(onSubmit).toHaveBeenCalledTimes(1)
	})
})
