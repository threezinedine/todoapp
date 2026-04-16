import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { Form } from './Form'
import type { FormHandle } from './FormProps'
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

export const WithRef: Story = {
	render: () => {
		const ref = useRef<FormHandle>(null)
		const refDiv = useRef<HTMLDivElement>(null)

		async function onSubmit(fields: Record<string, any>) {
			for (const [key, value] of Object.entries(fields)) {
				refDiv.current!.innerHTML += `${key}: ${value}<br/>`
			}
		}

		return (
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
					ref={ref}
					fields={[
						{ field: 'Username', type: 'text' },
						{ field: 'Password', type: 'password' },
					]}
					onSubmit={onSubmit}
					submitButton={
						<Button
							variant="glick-black"
							text="Submit"
							borderRadius="none"
							size="full"
						/>
					}
				/>
				<Button
					variant="glass-morphism"
					text="Log Values"
					onClick={async () => await ref.current?.submit()}
				/>
				<Button
					variant="glass-morphism"
					text="Reset Form"
					onClick={async () => await ref.current?.reset()}
				/>

				<div
					style={{ color: '#fff' }}
					ref={refDiv}
				></div>
			</div>
		)
	},
}
