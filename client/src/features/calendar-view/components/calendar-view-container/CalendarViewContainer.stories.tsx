import type { Meta, StoryObj } from '@storybook/react'
import { CalendarViewContainer } from './CalendarViewContainer'

const meta: Meta<typeof CalendarViewContainer> = {
	component: CalendarViewContainer,
	tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof CalendarViewContainer>

export const Default: Story = {
	render: () => {
		return (
			<div
				style={{
					backgroundColor: '#202020',
					padding: '16px',
					height: '80vh',
					maxHeight: '80vh',
					overflow: 'hidden',
				}}
			>
				<CalendarViewContainer />
			</div>
		)
	},
}
