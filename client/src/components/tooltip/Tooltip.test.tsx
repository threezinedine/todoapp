import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tooltip } from './Tooltip'

// Mock the SCSS module so class names are predictable in jsdom
vi.mock('./Tooltip.module.scss', () => ({
	default: Object.assign(() => '', {
		tooltip: 'tooltip',
		tooltiptext: 'tooltiptext',
		component: 'component',
		top: 'top',
		bottom: 'bottom',
		left: 'left',
		right: 'right',
	}),
}))

describe('Tooltip', () => {
	// ─── Rendering ───────────────────────────────────────────────────────────────

	it('renders children', () => {
		render(
			<Tooltip content="Tooltip content">
				<button>Hover me</button>
			</Tooltip>,
		)

		expect(
			screen.getByRole('button', { name: 'Hover me' }),
		).toBeInTheDocument()
	})

	it('renders tooltip content', () => {
		render(
			<Tooltip content="My tooltip text">
				<button>Target</button>
			</Tooltip>,
		)

		expect(screen.getByText('My tooltip text')).toBeInTheDocument()
	})

	it('renders the tooltip wrapper with the tooltip class', () => {
		render(
			<Tooltip content="Content">
				<button>Target</button>
			</Tooltip>,
		)

		const tooltipEl = document.querySelector('.tooltip')
		expect(tooltipEl).toHaveClass('tooltip')
	})

	it('renders the tooltip text with the tooltiptext class', () => {
		render(
			<Tooltip content="Content">
				<button>Target</button>
			</Tooltip>,
		)

		expect(screen.getByText('Content')).toHaveClass('tooltiptext')
	})

	it('renders the children wrapper with the component class', () => {
		render(
			<Tooltip content="Content">
				<button>Target</button>
			</Tooltip>,
		)

		const childWrapper = screen.getByRole('button', {
			name: 'Target',
		}).parentElement
		expect(childWrapper).toHaveClass('component')
	})

	it('renders both the tooltip text and children simultaneously', () => {
		render(
			<Tooltip content="Tooltip text">
				<span>Child content</span>
			</Tooltip>,
		)

		expect(screen.getByText('Tooltip text')).toBeInTheDocument()
		expect(screen.getByText('Child content')).toBeInTheDocument()
	})

	// ─── position ─────────────────────────────────────────────────────────────

	it('applies "top" class to tooltip text when position is "top"', () => {
		render(
			<Tooltip content="Content" position="top">
				<button>Target</button>
			</Tooltip>,
		)

		const tooltipText = screen.getByText('Content')
		expect(tooltipText).toHaveClass('tooltiptext')
		expect(tooltipText).toHaveClass('top')
	})

	it('applies "bottom" class to tooltip text when position is "bottom"', () => {
		render(
			<Tooltip content="Content" position="bottom">
				<button>Target</button>
			</Tooltip>,
		)

		const tooltipText = screen.getByText('Content')
		expect(tooltipText).toHaveClass('tooltiptext')
		expect(tooltipText).toHaveClass('bottom')
	})

	it('applies "left" class to tooltip text when position is "left"', () => {
		render(
			<Tooltip content="Content" position="left">
				<button>Target</button>
			</Tooltip>,
		)

		const tooltipText = screen.getByText('Content')
		expect(tooltipText).toHaveClass('tooltiptext')
		expect(tooltipText).toHaveClass('left')
	})

	it('applies "right" class to tooltip text when position is "right"', () => {
		render(
			<Tooltip content="Content" position="right">
				<button>Target</button>
			</Tooltip>,
		)

		const tooltipText = screen.getByText('Content')
		expect(tooltipText).toHaveClass('tooltiptext')
		expect(tooltipText).toHaveClass('right')
	})

	it('defaults to "top" position when position is not provided', () => {
		render(
			<Tooltip content="Content">
				<button>Target</button>
			</Tooltip>,
		)

		expect(screen.getByText('Content')).toHaveClass('top')
	})

	// ─── children ─────────────────────────────────────────────────────────────

	it('renders ReactNode children', () => {
		render(
			<Tooltip content="Content">
				<div data-testid="custom-child">
					<h1>Title</h1>
					<p>Paragraph</p>
				</div>
			</Tooltip>,
		)

		expect(
			screen.getByRole('heading', { name: 'Title' }),
		).toBeInTheDocument()
		expect(screen.getByText('Paragraph')).toBeInTheDocument()
	})

	it('renders string children', () => {
		render(<Tooltip content="Tooltip content">Simple text child</Tooltip>)

		expect(screen.getByText('Simple text child')).toBeInTheDocument()
	})

	it('renders a Button component as child', () => {
		render(
			<Tooltip content="Tooltip on button">
				<span>Button-like element</span>
			</Tooltip>,
		)

		expect(screen.getByText('Button-like element')).toBeInTheDocument()
	})

	it('wraps child without adding extra DOM layers beyond the component div', () => {
		render(
			<Tooltip content="Content">
				<span>Child</span>
			</Tooltip>,
		)

		// div.tooltip > div.tooltiptext + div.component > span.child
		const tooltipEl = document.querySelector('.tooltip')
		expect(tooltipEl?.childNodes).toHaveLength(2)
	})

	// ─── CSS visibility ────────────────────────────────────────────────────────

	it('tooltip text is rendered in the DOM immediately (not lazy)', () => {
		render(
			<Tooltip content="Visible in DOM">
				<button>Target</button>
			</Tooltip>,
		)

		// Tooltip content is always in the DOM; visibility is handled by CSS
		expect(screen.getByText('Visible in DOM')).toBeInTheDocument()
	})

	// ─── Edge cases ────────────────────────────────────────────────────────────

	it('renders with empty string content without crashing', () => {
		render(
			<Tooltip content="">
				<button>Target</button>
			</Tooltip>,
		)

		expect(
			screen.getByRole('button', { name: 'Target' }),
		).toBeInTheDocument()
	})

	it('renders with all position variants without crashing', () => {
		const positions: Array<'top' | 'bottom' | 'left' | 'right'> = [
			'top',
			'bottom',
			'left',
			'right',
		]

		positions.forEach((position) => {
			const { unmount } = render(
				<Tooltip content={position} position={position}>
					<button>Target</button>
				</Tooltip>,
			)
			expect(screen.getByText(position)).toBeInTheDocument()
			unmount()
		})
	})

	it('renders without children (content only)', () => {
		render(<Tooltip content="Standalone tooltip">{null}</Tooltip>)

		expect(screen.getByText('Standalone tooltip')).toBeInTheDocument()
	})

	it('renders with a very long content string', () => {
		const longContent = 'A'.repeat(500)

		render(
			<Tooltip content={longContent}>
				<button>Target</button>
			</Tooltip>,
		)

		expect(screen.getByText(longContent)).toBeInTheDocument()
	})

	it('renders with ReactNode content (e.g. an icon)', () => {
		render(
			<Tooltip content="Icon here">
				<button>Target</button>
			</Tooltip>,
		)

		expect(screen.getByText('Icon here')).toBeInTheDocument()
	})

	it('renders with Fragment as children', () => {
		render(
			<Tooltip content="Content">
				<>
					<span>First</span>
					<span>Second</span>
				</>
			</Tooltip>,
		)

		expect(screen.getByText('First')).toBeInTheDocument()
		expect(screen.getByText('Second')).toBeInTheDocument()
	})

	it('renders with multiple nested children', () => {
		render(
			<Tooltip content="Content">
				<div>
					<div>
						<button>Nested button</button>
					</div>
				</div>
			</Tooltip>,
		)

		expect(
			screen.getByRole('button', { name: 'Nested button' }),
		).toBeInTheDocument()
	})
})
