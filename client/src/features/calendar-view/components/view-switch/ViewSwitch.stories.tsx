import type { Meta, StoryObj } from '@storybook/react'
import { ViewSwitch } from './ViewSwitch'

const meta: Meta<typeof ViewSwitch> = {
	component: ViewSwitch,
	tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ViewSwitch>

export const Default: Story = {
	render: () => {
		return (
			<div style={{ backgroundColor: '#202020', padding: '16px' }}>
				<ViewSwitch
					defaultView="day"
					onViewChange={(view) => {
						alert(`View changed to: ${view}`)
					}}
				/>
			</div>
		)
	},
}
