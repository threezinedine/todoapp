import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

// Mock the SCSS module so class names are predictable in jsdom
vi.mock('./Modal.module.scss', () => ({
	default: {
		modal: 'modal',
		overlay: 'overlay',
		content: 'content',
		'border-radius-none': 'border-radius-none',
		'border-radius-small': 'border-radius-small',
		'border-radius-medium': 'border-radius-medium',
		'border-radius-large': 'border-radius-large',
	},
}))

const MODAL_TEST_ID = 'modal'

describe('Modal', () => {
	// ─── Rendering ───────────────────────────────────────────────────────────────

	it('renders children when open', () => {
		render(
			<Modal isOpen={true}>
				<span>Modal Content</span>
			</Modal>,
		)

		expect(screen.getByText('Modal Content')).toBeInTheDocument()
	})

	it('does not render children when closed', () => {
		render(
			<Modal isOpen={false}>
				<span>Modal Content</span>
			</Modal>,
		)

		expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
	})

	it('returns null when closed (no DOM node created)', () => {
		const { container } = render(
			<Modal isOpen={false}>
				<span>Modal Content</span>
			</Modal>,
		)

		expect(container.firstChild).toBeNull()
	})

	// ─── dataTestId ─────────────────────────────────────────────────────────────

	it('renders the outer div with the provided data-testid', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		expect(screen.getByTestId(MODAL_TEST_ID)).toBeInTheDocument()
	})

	it('renders the overlay div with data-testid "<dataTestId>-overlay"', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		expect(screen.getByTestId(`${MODAL_TEST_ID}-overlay`)).toBeInTheDocument()
	})

	it('renders the content div with data-testid "<dataTestId>-content"', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		expect(screen.getByTestId(`${MODAL_TEST_ID}-content`)).toBeInTheDocument()
	})

	// ─── onClose callback ───────────────────────────────────────────────────────

	it('calls onClose when clicking the overlay', async () => {
		const user = userEvent.setup()
		const onClose = vi.fn()

		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID} onClose={onClose}>
				<span>Modal Content</span>
			</Modal>,
		)

		await user.click(screen.getByTestId(`${MODAL_TEST_ID}-overlay`))

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('does not call onClose when clicking the modal content itself', async () => {
		const user = userEvent.setup()
		const onClose = vi.fn()

		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID} onClose={onClose}>
				<span>Modal Content</span>
			</Modal>,
		)

		await user.click(screen.getByTestId(`${MODAL_TEST_ID}-content`))

		expect(onClose).not.toHaveBeenCalled()
	})

	it('does not call onClose when onClose is not provided and overlay is clicked', async () => {
		const user = userEvent.setup()

		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Modal Content</span>
			</Modal>,
		)

		// Should not throw — onClose is optional
		await user.click(screen.getByTestId(`${MODAL_TEST_ID}-overlay`))

		expect(screen.getByText('Modal Content')).toBeInTheDocument()
	})

	it('calls onClose once per each valid overlay click', async () => {
		const user = userEvent.setup()
		const onClose = vi.fn()

		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID} onClose={onClose}>
				<span>Modal Content</span>
			</Modal>,
		)

		const overlay = screen.getByTestId(`${MODAL_TEST_ID}-overlay`)
		await user.click(overlay)
		await user.click(overlay)

		expect(onClose).toHaveBeenCalledTimes(2)
	})

	// ─── borderRadius variants ──────────────────────────────────────────────────

	it('applies no border radius when borderRadius is "none"', () => {
		render(
			<Modal
				isOpen={true}
				dataTestId={MODAL_TEST_ID}
				borderRadius="none"
			>
				<span>Content</span>
			</Modal>,
		)

		expect(
			screen.getByTestId(`${MODAL_TEST_ID}-content`),
		).toHaveClass('border-radius-none')
	})

	it('applies small border radius when borderRadius is "small"', () => {
		render(
			<Modal
				isOpen={true}
				dataTestId={MODAL_TEST_ID}
				borderRadius="small"
			>
				<span>Content</span>
			</Modal>,
		)

		expect(
			screen.getByTestId(`${MODAL_TEST_ID}-content`),
		).toHaveClass('border-radius-small')
	})

	it('applies medium border radius when borderRadius is "medium"', () => {
		render(
			<Modal
				isOpen={true}
				dataTestId={MODAL_TEST_ID}
				borderRadius="medium"
			>
				<span>Content</span>
			</Modal>,
		)

		expect(
			screen.getByTestId(`${MODAL_TEST_ID}-content`),
		).toHaveClass('border-radius-medium')
	})

	it('applies large border radius when borderRadius is "large"', () => {
		render(
			<Modal
				isOpen={true}
				dataTestId={MODAL_TEST_ID}
				borderRadius="large"
			>
				<span>Content</span>
			</Modal>,
		)

		expect(
			screen.getByTestId(`${MODAL_TEST_ID}-content`),
		).toHaveClass('border-radius-large')
	})

	it('defaults to medium border radius when borderRadius is not provided', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		expect(
			screen.getByTestId(`${MODAL_TEST_ID}-content`),
		).toHaveClass('border-radius-medium')
	})

	// ─── Structure / accessibility ─────────────────────────────────────────────

	it('renders exactly one overlay and one content div', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		const overlays = screen.getAllByTestId(`${MODAL_TEST_ID}-overlay`)
		const contents = screen.getAllByTestId(`${MODAL_TEST_ID}-content`)

		expect(overlays).toHaveLength(1)
		expect(contents).toHaveLength(1)
	})

	it('renders the overlay with the overlay class name', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		expect(screen.getByTestId(`${MODAL_TEST_ID}-overlay`)).toHaveClass('overlay')
	})

	it('renders the content with the content class name', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		expect(screen.getByTestId(`${MODAL_TEST_ID}-content`)).toHaveClass('content')
	})

	it('renders multiple children correctly', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<h1>Title</h1>
				<p>Paragraph</p>
				<button>Action</button>
			</Modal>,
		)

		expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
		expect(screen.getByText('Paragraph')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
	})

	// ─── Open / close transitions ───────────────────────────────────────────────

	it('transitions from open to closed by removing itself from the DOM', () => {
		const { rerender } = render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Modal Content</span>
			</Modal>,
		)

		expect(screen.getByText('Modal Content')).toBeInTheDocument()

		rerender(
			<Modal isOpen={false} dataTestId={MODAL_TEST_ID}>
				<span>Modal Content</span>
			</Modal>,
		)

		expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
	})

	it('transitions from closed to open by rendering itself', () => {
		const { rerender } = render(
			<Modal isOpen={false} dataTestId={MODAL_TEST_ID}>
				<span>Modal Content</span>
			</Modal>,
		)

		expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()

		rerender(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Modal Content</span>
			</Modal>,
		)

		expect(screen.getByText('Modal Content')).toBeInTheDocument()
	})

	// ─── Edge cases ─────────────────────────────────────────────────────────────

	it('renders with null children without crashing', () => {
		render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				{null}
			</Modal>,
		)

		expect(screen.getByTestId(MODAL_TEST_ID)).toBeInTheDocument()
		expect(screen.getByTestId(`${MODAL_TEST_ID}-overlay`)).toBeInTheDocument()
		expect(screen.getByTestId(`${MODAL_TEST_ID}-content`)).toBeInTheDocument()
	})

	it('renders without dataTestId (data-testid is optional)', () => {
		const { container } = render(
			<Modal isOpen={true}>
				<span>Content</span>
			</Modal>,
		)

		expect(container.firstChild).not.toBeNull()
	})

	it('renders without onClose (onClose is optional)', () => {
		const { container } = render(
			<Modal isOpen={true} dataTestId={MODAL_TEST_ID}>
				<span>Content</span>
			</Modal>,
		)

		expect(container.firstChild).not.toBeNull()
	})

	it('renders with all borderRadius variants without crashing', () => {
		const variants: Array<'none' | 'small' | 'medium' | 'large'> = [
			'none',
			'small',
			'medium',
			'large',
		]

		variants.forEach((variant) => {
			const { unmount } = render(
				<Modal
					isOpen={true}
					dataTestId={MODAL_TEST_ID}
					borderRadius={variant}
				>
					<span>{variant}</span>
				</Modal>,
			)
			expect(screen.getByText(variant)).toBeInTheDocument()
			unmount()
		})
	})
})
