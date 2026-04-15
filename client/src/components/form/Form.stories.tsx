import type { Meta, StoryObj } from '@storybook/react'
import { Form } from './Form'
import { Button } from '~/components/button'

const meta: Meta<typeof Form> = {
	component: Form,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Form>

export const Default: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				backgroundColor: '#050505',
				padding: '3rem',
			}}
		>
			<Form
				fields={[
					{ field: 'Username', type: 'text' },
					{ field: 'Password', type: 'password' },
					{ field: 'Email', type: 'email' },
					{ field: 'Age', type: 'number' },
				]}
				submitButton={
					<Button
						variant="glick-black"
						text="Submit"
						borderRadius="none"
						size="full"
					/>
				}
			/>
		</div>
	),
}
