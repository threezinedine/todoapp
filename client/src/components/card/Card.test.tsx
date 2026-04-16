import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from './Card'

// Mock the SCSS module so class names are predictable in jsdom
vi.mock('./Card.module.scss', () => ({
	default: Object.assign(() => '', {
		card: 'card',
		'card-header': 'card-header',
		'card-title': 'card-title',
		'card-dots': 'card-dots',
		'card-body': 'card-body',
	}),
}))

// Mock the icon — direct inline arrow so vitest can hoist the vi.mock call
vi.mock('~/icons', () => ({
	SecureDataIcon: () => <svg data-testid="secure-data-icon" />,
}))

const CARD_TEST_ID = 'card'

describe('Card', () => {
	// ─── Rendering ───────────────────────────────────────────────────────────────

	it('renders with title and content', () => {
		render(
			<Card
				title="My Card"
				content={<span>Card body content</span>}
			/>,
		)

		expect(screen.getByText('My Card')).toBeInTheDocument()
		expect(screen.getByText('Card body content')).toBeInTheDocument()
	})

	it('renders the card with the card class', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		expect(screen.getByTestId(CARD_TEST_ID)).toHaveClass('card')
	})

	it('renders the card header with the card-header class', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		expect(screen.getByTestId(`${CARD_TEST_ID}-header`)).toHaveClass('card-header')
	})

	it('renders the card body with the card-body class', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		expect(screen.getByTestId(`${CARD_TEST_ID}-body`)).toHaveClass('card-body')
	})

	it('renders the card title with the card-title class', () => {
		render(
			<Card
				title="My Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		const title = screen.getByText('My Title')
		expect(title.parentElement).toHaveClass('card-title')
	})

	it('renders three dots in the card header', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		const dotsContainer = document.querySelector('.card-dots')
		const dots = dotsContainer?.querySelectorAll('span')
		expect(dots).toHaveLength(3)
	})

	// ─── dataTestId ─────────────────────────────────────────────────────────────

	it('applies data-testid to the outer card div', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		expect(screen.getByTestId(CARD_TEST_ID)).toBeInTheDocument()
	})

	it('applies data-testid with "-header" suffix to the header div', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		expect(screen.getByTestId(`${CARD_TEST_ID}-header`)).toBeInTheDocument()
	})

	it('applies data-testid with "-body" suffix to the body div', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
				dataTestId={CARD_TEST_ID}
			/>,
		)

		expect(screen.getByTestId(`${CARD_TEST_ID}-body`)).toBeInTheDocument()
	})

	it('does not apply data-testid attributes when dataTestId is undefined', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
			/>,
		)

		// Card-specific test IDs (derived from dataTestId) should not be set
		// The mock SVG's own data-testid is not a Card concern
		expect(document.querySelector('[data-testid="card"]')).toBeNull()
		expect(document.querySelector('[data-testid="card-header"]')).toBeNull()
		expect(document.querySelector('[data-testid="card-body"]')).toBeNull()
	})

	// ─── Icon ───────────────────────────────────────────────────────────────────

	it('renders the SecureDataIcon in the card title', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
			/>,
		)

		expect(screen.getByTestId('secure-data-icon')).toBeInTheDocument()
	})

	it('renders the icon before the title text', () => {
		render(
			<Card
				title="My Title"
				content={<span>Content</span>}
			/>,
		)

		const titleContainer = screen.getByText('My Title').parentElement
		const icon = titleContainer?.querySelector('svg')

		// Icon should come before the text span in DOM order
		const iconIndex = Array.from(titleContainer?.childNodes ?? []).indexOf(
			icon as Node,
		)
		const textIndex = Array.from(titleContainer?.childNodes ?? []).indexOf(
			screen.getByText('My Title') as Node,
		)
		expect(iconIndex).toBeLessThan(textIndex)
	})

	// ─── Content ────────────────────────────────────────────────────────────────

	it('renders ReactNode content correctly', () => {
		render(
			<Card
				title="Title"
				content={
					<div>
						<h2>Heading</h2>
						<p>Paragraph</p>
					</div>
				}
			/>,
		)

		expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument()
		expect(screen.getByText('Paragraph')).toBeInTheDocument()
	})

	it('renders multiple children in content', () => {
		render(
			<Card
				title="Title"
				content={
					<>
						<span>First</span>
						<span>Second</span>
					</>
				}
			/>,
		)

		expect(screen.getByText('First')).toBeInTheDocument()
		expect(screen.getByText('Second')).toBeInTheDocument()
	})

	// ─── Edge cases ─────────────────────────────────────────────────────────────

	it('renders with empty string title without crashing', () => {
		render(
			<Card
				title=""
				content={<span>Content</span>}
			/>,
		)

		// Multiple empty text nodes may exist; check the card title container still renders
		const titleContainer = document.querySelector('.card-title')
		expect(titleContainer).toBeInTheDocument()
		expect(screen.getByText('Content')).toBeInTheDocument()
	})

	it('renders with null content without crashing', () => {
		render(
			// @ts-expect-error testing edge case with null content
			<Card title="Title" content={null} />,
		)

		// Card should still render with the title
		expect(screen.getByText('Title')).toBeInTheDocument()
	})

	it('renders with undefined content without crashing', () => {
		render(
			// @ts-expect-error testing edge case with undefined content
			<Card title="Title" content={undefined} />,
		)

		expect(screen.getByText('Title')).toBeInTheDocument()
	})

	it('renders with all required props (no dataTestId)', () => {
		render(
			<Card
				title="Title"
				content={<span>Content</span>}
			/>,
		)

		expect(screen.getByText('Title')).toBeInTheDocument()
		expect(screen.getByText('Content')).toBeInTheDocument()
	})
})
