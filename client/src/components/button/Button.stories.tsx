import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
	component: Button,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const LightVariants: Story = {
	render: () => (
		<div
			className="light"
			style={{ display: 'flex', gap: '1rem' }}
		>
			<Button
				text="Normal"
				variant="normal"
			/>
		</div>
	),
}

export const DarkVariants: Story = {
	render: () => (
		<div
			className="dark"
			style={{
				display: 'flex',
				gap: '1rem',
				backgroundColor: '#333',
				padding: '1rem',
			}}
		>
			<Button
				text="Normal"
				variant="normal"
			/>
		</div>
	),
}

export const AllSizes: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Button
				text="Small"
				size="small"
			/>
			<Button
				text="Medium"
				size="medium"
			/>
			<Button
				text="Large"
				size="large"
			/>
			<Button
				text="Full"
				size="full"
			/>
		</div>
	),
}

export const AllBorderRadii: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Button
				text="None"
				borderRadius="none"
			/>
			<Button
				text="Small"
				borderRadius="small"
			/>
			<Button
				text="Medium"
				borderRadius="medium"
			/>
			<Button
				text="Large"
				borderRadius="large"
			/>
		</div>
	),
}

export const AllPaddings: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Button
				text="None"
				padding="none"
			/>
			<Button
				text="Small"
				padding="small"
			/>
			<Button
				text="Medium"
				padding="medium"
			/>
			<Button
				text="Large"
				padding="large"
			/>
		</div>
	),
}
