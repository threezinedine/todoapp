import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../button/Button'

const meta: Meta<typeof Tooltip> = {
	component: Tooltip,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
	render: () => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '3rem',
					backgroundColor: '#050505',
					padding: '3rem',
					paddingLeft: '15rem',
				}}
			>
				<Tooltip content="This is a tooltip">
					<Button
						text="Tooltip on"
						variant="glick"
					/>
				</Tooltip>

				<Tooltip
					content="This is a tooltip"
					position="left"
				>
					<Button
						text="Tooltip left"
						variant="glick"
					/>
				</Tooltip>

				<Tooltip
					content="This is a tooltip"
					position="right"
				>
					<Button
						text="Tooltip right"
						variant="glick"
					/>
				</Tooltip>

				<Tooltip
					content="This is a tooltip"
					position="bottom"
				>
					<Button
						text="Tooltip bottom"
						variant="glick"
					/>
				</Tooltip>
			</div>
		)
	},
}
