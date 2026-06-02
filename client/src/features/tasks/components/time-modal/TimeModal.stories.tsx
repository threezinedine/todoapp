import type { Meta, StoryObj } from '@storybook/react'
import { TimeModal } from './TimeModal'
import { useRef } from 'react'
import { Button } from '~/components'
import type { TimeModalHandle } from './TimeModalProps'

const meta: Meta<typeof TimeModal> = {
	title: 'Pomodoro/Time Modal',
	component: TimeModal,
}

export default meta

type Story = StoryObj<typeof TimeModal>

export const Default: Story = {
	render: () => {
		const ref = useRef<TimeModalHandle>(null)

		return (
			<div
				style={{
					backgroundColor: '#353535',
					width: '100%',
					height: '100vh',
					padding: '3rem',
				}}
			>
				<Button onClick={() => ref.current?.toggle()}>
					Toggle Modal
				</Button>
				<TimeModal ref={ref} />
			</div>
		)
	},
}
