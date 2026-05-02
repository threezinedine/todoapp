import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from './Dropdown'

// Mock the DropMenu component to avoid its SCSS module dependencies
vi.mock('~/components/drop-menu', () => ({
	DropMenu: vi.fn(({ items, isOpen }) =>
		isOpen ? (
			<div data-testid="drop-menu">
				{items.map(
					(
						item: { label?: string; onClick?: () => void },
						index: number,
					) =>
						item.onClick ? (
							<button
								key={index}
								data-testid={`menu-item-${index}`}
								onClick={item.onClick}
							>
								{item.label}
							</button>
						) : null,
				)}
			</div>
		) : null,
	),
}))

// Mock the SCSS module so class names are predictable in jsdom
vi.mock('./Dropdown.module.scss', () => ({
	default: Object.assign(() => '', {
		container: 'container',
		trigger: 'trigger',
	}),
}))

const TRIGGER_TEST_ID = 'dropdown-trigger'

describe('Dropdown', () => {
	// ─── Rendering ───────────────────────────────────────────────────────────────

	it('renders children as the trigger', () => {
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		expect(screen.getByTestId(TRIGGER_TEST_ID)).toBeInTheDocument()
	})

	it('does not render the menu on initial render', () => {
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		expect(screen.queryByTestId('drop-menu')).not.toBeInTheDocument()
	})

	it('renders the menu when opened', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
	})

	it('renders all menu items passed via items prop', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown
				items={[
					{ label: 'Option 1', onClick: vi.fn() },
					{ label: 'Option 2', onClick: vi.fn() },
					{ label: 'Option 3', onClick: vi.fn() },
				]}
			>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))

		expect(screen.getByTestId('menu-item-0')).toHaveTextContent('Option 1')
		expect(screen.getByTestId('menu-item-1')).toHaveTextContent('Option 2')
		expect(screen.getByTestId('menu-item-2')).toHaveTextContent('Option 3')
	})

	// ─── Open / Close ────────────────────────────────────────────────────────────

	it('opens the menu on trigger click', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
	})

	it('closes the menu on second trigger click (toggle)', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.queryByTestId('drop-menu')).not.toBeInTheDocument()
	})

	it('closes the menu when clicking outside the container', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()

		await user.click(document.body)
		expect(screen.queryByTestId('drop-menu')).not.toBeInTheDocument()
	})

	it('does not close the menu when clicking inside the container but outside the trigger', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()

		// Click on the menu itself (which is inside the container)
		await user.click(screen.getByTestId('drop-menu'))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
	})

	// ─── Menu item interaction ───────────────────────────────────────────────────

	it('calls the onClick callback when a menu item is clicked', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()

		render(
			<Dropdown
				items={[
					{ label: 'Option 1', onClick },
					{ label: 'Option 2', onClick: vi.fn() },
				]}
			>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		await user.click(screen.getByTestId('menu-item-0'))

		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('closes the menu when clicking a menu item', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown
				items={[
					{ label: 'Option 1', onClick: vi.fn() },
					{ label: 'Option 2', onClick: vi.fn() },
				]}
			>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()

		await user.click(screen.getByTestId('menu-item-0'))
		expect(screen.queryByTestId('drop-menu')).not.toBeInTheDocument()
	})

	it('closes the menu when clicking any menu item', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown
				items={[
					{ label: 'Option 1', onClick: vi.fn() },
					{ label: 'Option 2', onClick: vi.fn() },
					{ label: 'Option 3', onClick: vi.fn() },
				]}
			>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()

		await user.click(screen.getByTestId('menu-item-2'))
		expect(screen.queryByTestId('drop-menu')).not.toBeInTheDocument()
	})

	// ─── Edge cases ──────────────────────────────────────────────────────────────

	it('renders with an empty items array without crashing', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
	})

	it('renders with items that have no onClick callback', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[{ label: 'Option 1' }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
	})

	it('can be re-opened after closing via outside click', async () => {
		const user = userEvent.setup()
		render(
			<Dropdown items={[{ label: 'Option 1', onClick: vi.fn() }]}>
				<button data-testid={TRIGGER_TEST_ID}>Open</button>
			</Dropdown>,
		)

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()

		await user.click(document.body)
		expect(screen.queryByTestId('drop-menu')).not.toBeInTheDocument()

		await user.click(screen.getByTestId(TRIGGER_TEST_ID))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
	})

	it('multiple dropdowns are independent — opening one closes the other', async () => {
		const user = userEvent.setup()
		render(
			<>
				<Dropdown items={[{ label: 'A1', onClick: vi.fn() }]}>
					<button data-testid="dropdown-a-trigger">Open A</button>
				</Dropdown>
				<Dropdown items={[{ label: 'B1', onClick: vi.fn() }]}>
					<button data-testid="dropdown-b-trigger">Open B</button>
				</Dropdown>
			</>,
		)

		await user.click(screen.getByTestId('dropdown-a-trigger'))
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
		expect(screen.getByText('A1')).toBeInTheDocument()

		// Clicking B's trigger closes A's menu (it acts as an outside click on A)
		await user.click(screen.getByTestId('dropdown-b-trigger'))
		expect(screen.queryByText('A1')).not.toBeInTheDocument()
		expect(screen.getByTestId('drop-menu')).toBeInTheDocument()
		expect(screen.getByText('B1')).toBeInTheDocument()
	})
})
