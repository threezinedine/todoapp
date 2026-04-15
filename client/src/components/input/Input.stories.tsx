import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { useState } from 'react'

const meta: Meta<typeof Input> = {
	component: Input,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
	render: () => {
		const [username, setUsername] = useState('')
		const [password, setPassword] = useState('')
		const [email, setEmail] = useState('')
		const [age, setAge] = useState('')

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
				<Input
					field="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					type="text"
				/>
				<Input
					field="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
				/>
				<Input
					field="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
				/>
				<Input
					field="Age"
					value={age}
					onChange={(e) => setAge(e.target.value)}
					type="number"
				/>
			</div>
		)
	},
}
