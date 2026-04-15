import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { OpenAIIcon } from '~/icons'

const meta: Meta<typeof Card> = {
	component: Card,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
	render: () => (
		<div style={{ padding: '2rem', backgroundColor: '#f0f0f0' }}>
			<Card
				title="Card Title"
				content={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
						}}
					>
						<p>
							This is the content of the card. It can include
							text, images, or any other React nodes.
						</p>
						<OpenAIIcon />
					</div>
				}
			/>
		</div>
	),
}
