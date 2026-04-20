import type { Meta, StoryObj } from '@storybook/react'
import { ValidateModal } from './ValidateModal'
import type { ValidateModalHandle } from './ValidateModalProps'
import { useRef } from 'react'
import { Button } from '~/components'

const meta: Meta<typeof ValidateModal> = {
	component: ValidateModal,
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ValidateModal>

export const Default: Story = {
	render: () => {
		const modalRef = useRef<ValidateModalHandle>(null)

		return (
			<div>
				<Button
					text="Open Modal"
					onClick={async () => modalRef.current?.open()}
				/>
				<ValidateModal
					ref={modalRef}
					onCancel={async () => alert('On cancel')}
					onConfirm={async () => alert('on Confirm')}
					content="Do you wanna quit?"
				/>
			</div>
		)
	},
}
