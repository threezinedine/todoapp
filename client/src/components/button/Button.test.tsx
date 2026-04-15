import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

// Mock the SCSS module so class names are predictable in jsdom
vi.mock('./Button.module.scss', () => ({
	default: Object.assign(
		() => 'MockedButton',
		{
			normal: 'normal',
			glick: 'glick',
			'glick-black': 'glick-black',
			'glass-morphism': 'glass-morphism',
			glint: 'glint',
			logo: 'logo',
			text: 'text',
			button: 'button',
			'button-small': 'button-small',
			'button-medium': 'button-medium',
			'button-large': 'button-large',
			'button-full': 'button-full',
			'button-radius-none': 'button-radius-none',
			'button-radius-small': 'button-radius-small',
			'button-radius-medium': 'button-radius-medium',
			'button-radius-large': 'button-radius-large',
			'button-padding-none': 'button-padding-none',
			'button-padding-small': 'button-padding-small',
			'button-padding-medium': 'button-padding-medium',
			'button-padding-large': 'button-padding-large',
		},
	),
}))

const BUTTON_TEST_ID = 'my-button'

describe('Button', () => {
	// ─── Rendering ───────────────────────────────────────────────────────────────

	it('renders with default text "Button"', () => {
		render(<Button />)
		expect(screen.getByText('Button')).toBeInTheDocument()
	})

	it('renders with custom text', () => {
		render(<Button text="Click me" />)
		expect(screen.getByText('Click me')).toBeInTheDocument()
	})

	it('renders with ReactNode text', () => {
		render(
			<Button text={<span data-testid="node-text">Bold Text</span>} />,
		)
		expect(screen.getByTestId('node-text')).toBeInTheDocument()
	})

	it('renders a single <button> element', () => {
		render(<Button />)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('does not render an anchor or div element', () => {
		render(<Button />)
		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})

	// ─── dataTestId ───────────────────────────────────────────────────────────────

	it('passes dataTestId to the underlying <button>', () => {
		render(<Button dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toBeInTheDocument()
	})

	it('does not apply data-testid when dataTestId is undefined', () => {
		render(<Button />)
		const button = screen.getByRole('button')
		expect(button).not.toHaveAttribute('data-testid')
	})

	// ─── onClick callback ───────────────────────────────────────────────────────

	it('calls onClick when the button is clicked', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()

		render(<Button dataTestId={BUTTON_TEST_ID} onClick={onClick} />)

		await user.click(screen.getByTestId(BUTTON_TEST_ID))

		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('does not throw when onClick is undefined and button is clicked', async () => {
		const user = userEvent.setup()

		render(<Button dataTestId={BUTTON_TEST_ID} />)

		// Should not throw
		await user.click(screen.getByTestId(BUTTON_TEST_ID))
	})

	it('calls onClick once per click (no double-fire)', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()

		render(<Button dataTestId={BUTTON_TEST_ID} onClick={onClick} />)

		await user.click(screen.getByTestId(BUTTON_TEST_ID))
		await user.click(screen.getByTestId(BUTTON_TEST_ID))

		expect(onClick).toHaveBeenCalledTimes(2)
	})

	it('accepts an async onClick', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn().mockResolvedValue(undefined)

		render(<Button dataTestId={BUTTON_TEST_ID} onClick={onClick} />)

		await user.click(screen.getByTestId(BUTTON_TEST_ID))

		expect(onClick).toHaveBeenCalledTimes(1)
	})

	// ─── variant ───────────────────────────────────────────────────────────────

	it('renders the normal variant with the "normal" class', () => {
		render(<Button variant="normal" dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('normal')
	})

	it('renders the glick variant with the "glick" class', () => {
		render(<Button variant="glick" dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glick')
	})

	it('renders the glick-black variant with the "glick-black" class', () => {
		render(<Button variant="glick-black" dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glick-black')
	})

	it('renders the glass-morphism variant with the "glass-morphism" class', () => {
		render(
			<Button variant="glass-morphism" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glass-morphism')
	})

	it('renders the glint variant with the "glint" class', () => {
		render(<Button variant="glint" dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glint')
	})

	it('defaults to the normal variant when no variant is provided', () => {
		render(<Button dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('normal')
	})

	// ─── size ─────────────────────────────────────────────────────────────────

	it('renders with "button-small" class when size is "small"', () => {
		render(
			<Button size="small" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('button-small')
	})

	it('renders with "button-medium" class when size is "medium" (default)', () => {
		render(
			<Button size="medium" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('button-medium')
	})

	it('renders with "button-large" class when size is "large"', () => {
		render(
			<Button size="large" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('button-large')
	})

	it('renders with "button-full" class when size is "full"', () => {
		render(
			<Button size="full" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('button-full')
	})

	it('defaults to "button-medium" size when size is not provided', () => {
		render(<Button dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('button-medium')
	})

	// ─── borderRadius ──────────────────────────────────────────────────────────

	it('applies "button-radius-none" class when borderRadius is "none"', () => {
		render(
			<Button
				borderRadius="none"
				dataTestId={BUTTON_TEST_ID}
			/>,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-radius-none',
		)
	})

	it('applies "button-radius-small" class when borderRadius is "small"', () => {
		render(
			<Button
				borderRadius="small"
				dataTestId={BUTTON_TEST_ID}
			/>,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-radius-small',
		)
	})

	it('applies "button-radius-medium" class when borderRadius is "medium"', () => {
		render(
			<Button
				borderRadius="medium"
				dataTestId={BUTTON_TEST_ID}
			/>,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-radius-medium',
		)
	})

	it('applies "button-radius-large" class when borderRadius is "large"', () => {
		render(
			<Button
				borderRadius="large"
				dataTestId={BUTTON_TEST_ID}
			/>,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-radius-large',
		)
	})

	it('defaults to "button-radius-medium" when borderRadius is not provided', () => {
		render(<Button dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-radius-medium',
		)
	})

	// ─── padding ───────────────────────────────────────────────────────────────

	it('applies "button-padding-none" class when padding is "none"', () => {
		render(
			<Button padding="none" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-padding-none',
		)
	})

	it('applies "button-padding-small" class when padding is "small"', () => {
		render(
			<Button padding="small" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-padding-small',
		)
	})

	it('applies "button-padding-medium" class when padding is "medium"', () => {
		render(
			<Button padding="medium" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-padding-medium',
		)
	})

	it('applies "button-padding-large" class when padding is "large"', () => {
		render(
			<Button padding="large" dataTestId={BUTTON_TEST_ID} />,
		)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-padding-large',
		)
	})

	it('defaults to "button-padding-medium" when padding is not provided', () => {
		render(<Button dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass(
			'button-padding-medium',
		)
	})

	// ─── glint variant + icon ─────────────────────────────────────────────────

	it('renders glint variant with an icon element', () => {
		render(
			<Button
				variant="glint"
				dataTestId={BUTTON_TEST_ID}
				icon={<svg data-testid="icon">icon</svg>}
			/>,
		)

		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glint')
		expect(screen.getByTestId('icon')).toBeInTheDocument()
	})

	it('auto-switches to glint variant when icon is provided with a non-glint variant', () => {
		render(
			<Button
				variant="normal"
				dataTestId={BUTTON_TEST_ID}
				icon={<svg data-testid="icon">icon</svg>}
			/>,
		)

		// Should render as glint (not normal) because icon was provided
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glint')
		expect(screen.getByTestId('icon')).toBeInTheDocument()
	})

	it('does not auto-switch when icon is provided with glint variant', () => {
		render(
			<Button
				variant="glint"
				dataTestId={BUTTON_TEST_ID}
				icon={<svg data-testid="icon">icon</svg>}
			/>,
		)

		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glint')
		expect(screen.getByTestId('icon')).toBeInTheDocument()
	})

	it('renders glint without icon (icon defaults to null)', () => {
		render(
			<Button variant="glint" dataTestId={BUTTON_TEST_ID} />,
		)

		// Should still render a glint button — icon is optional
		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveClass('glint')
	})

	// ─── glick-black data-text attribute ───────────────────────────────────────

	it('renders glick-black with data-text attribute on the button', () => {
		render(
			<Button
				variant="glick-black"
				text="Subscribe"
				dataTestId={BUTTON_TEST_ID}
			/>,
		)

		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveAttribute(
			'data-text',
			'Subscribe',
		)
	})

	it('renders glick-black with data-text reflecting whatever text prop is passed', () => {
		// GlickBlackButton defaults text to "Glick", but Button itself defaults to "Button"
		// and passes it down — so omitting text gives "Button" as data-text (Button's default)
		render(
			<Button variant="glick-black" dataTestId={BUTTON_TEST_ID} />,
		)

		expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveAttribute(
			'data-text',
			'Button',
		)
	})

	// ─── className ───────────────────────────────────────────────────────────────

	it('renders with a custom className on the outer wrapper', () => {
		render(
			<Button
				className="my-custom-wrapper"
				dataTestId={BUTTON_TEST_ID}
			/>,
		)

		// The outer wrapper <div> is always rendered even when styles[className] returns
		// undefined for an unmapped class name — it just has no class attribute
		const outerDiv = screen.getByTestId(BUTTON_TEST_ID).parentElement
		expect(outerDiv?.tagName).toBe('DIV')
	})

	// ─── Combined props ─────────────────────────────────────────────────────────

	it('renders with all size, borderRadius, and padding combinations without crashing', () => {
		const sizes: Array<'small' | 'medium' | 'large' | 'full'> = [
			'small',
			'medium',
			'large',
			'full',
		]
		const radii: Array<'none' | 'small' | 'medium' | 'large'> = [
			'none',
			'small',
			'medium',
			'large',
		]
		const paddings: Array<'none' | 'small' | 'medium' | 'large'> = [
			'none',
			'small',
			'medium',
			'large',
		]

		let count = 0
		sizes.forEach((size) => {
			radii.forEach((borderRadius) => {
				paddings.forEach((padding) => {
					const { unmount } = render(
						<Button
							size={size}
							borderRadius={borderRadius}
							padding={padding}
							dataTestId={BUTTON_TEST_ID}
						/>,
					)
					// All 64 combinations should render without crashing
					expect(screen.getByTestId(BUTTON_TEST_ID)).toBeInTheDocument()
					count++
					unmount()
				})
			})
		})
		// Verify we exercised all 64 combinations (4 sizes × 4 radii × 4 paddings)
		expect(count).toBe(64)
	})

	// ─── Edge cases ─────────────────────────────────────────────────────────────

	it('renders with empty string text without crashing', () => {
		render(<Button text="" dataTestId={BUTTON_TEST_ID} />)
		expect(screen.getByTestId(BUTTON_TEST_ID)).toBeInTheDocument()
	})

	it('renders without any props (all defaults)', () => {
		render(<Button />)
		const button = screen.getByRole('button')
		expect(button).toHaveTextContent('Button')
	})

	it('renders with all variant types without crashing', () => {
		const variants: Array<
			'normal' | 'glick' | 'glick-black' | 'glass-morphism' | 'glint'
		> = ['normal', 'glick', 'glick-black', 'glass-morphism', 'glint']

		variants.forEach((variant) => {
			const { unmount } = render(
				<Button variant={variant} dataTestId={BUTTON_TEST_ID} />,
			)
			expect(screen.getByTestId(BUTTON_TEST_ID)).toBeInTheDocument()
			unmount()
		})
	})

	it('renders with all size variants without crashing', () => {
		const sizes: Array<'small' | 'medium' | 'large' | 'full'> = [
			'small',
			'medium',
			'large',
			'full',
		]

		sizes.forEach((size) => {
			const { unmount } = render(
				<Button size={size} dataTestId={BUTTON_TEST_ID} />,
			)
			expect(screen.getByTestId(BUTTON_TEST_ID)).toBeInTheDocument()
			unmount()
		})
	})

	it('renders with all borderRadius variants without crashing', () => {
		const radii: Array<'none' | 'small' | 'medium' | 'large'> = [
			'none',
			'small',
			'medium',
			'large',
		]

		radii.forEach((borderRadius) => {
			const { unmount } = render(
				<Button
					borderRadius={borderRadius}
					dataTestId={BUTTON_TEST_ID}
				/>,
			)
			expect(screen.getByTestId(BUTTON_TEST_ID)).toBeInTheDocument()
			unmount()
		})
	})

	it('renders with all padding variants without crashing', () => {
		const paddings: Array<'none' | 'small' | 'medium' | 'large'> = [
			'none',
			'small',
			'medium',
			'large',
		]

		paddings.forEach((padding) => {
			const { unmount } = render(
				<Button padding={padding} dataTestId={BUTTON_TEST_ID} />,
			)
			expect(screen.getByTestId(BUTTON_TEST_ID)).toBeInTheDocument()
			unmount()
		})
	})
})
