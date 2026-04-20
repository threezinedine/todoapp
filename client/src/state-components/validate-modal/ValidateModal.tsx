import { forwardRef, useImperativeHandle, useState } from 'react'
import type {
	ValidateModalHandle,
	ValidateModalProps,
} from './ValidateModalProps'
import { Modal, Card, Button } from '~/components'
import styles from './ValidateModal.module.scss'
import clsx from 'clsx'

export const ValidateModal = forwardRef<
	ValidateModalHandle,
	ValidateModalProps
>(function ValidateModal(
	{ icon, content, onCancel, onConfirm, dataTestId }: ValidateModalProps,
	ref,
) {
	const [isOpen, setIsOpen] = useState(false)

	useImperativeHandle(ref, () => ({
		open: () => setIsOpen(true),
		close: () => setIsOpen(false),
		toggle: () => setIsOpen((current) => !current),
	}))

	async function handleCancel() {
		await onCancel()
		setIsOpen(false)
	}

	async function handleConfirm() {
		await onConfirm()
		setIsOpen(false)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			dataTestId={dataTestId}
		>
			<Card
				title="Confirm"
				icon={icon}
				content={
					<div className={clsx(styles.container)}>
						<p className={clsx(styles.content)}>{content}</p>
						<div className={clsx(styles.buttons)}>
							<Button
								dataTestId={`${dataTestId}-cancel`}
								text="Cancel"
								onClick={handleCancel}
								variant="glick-black"
							/>
							<Button
								variant="glick"
								text="Confirm"
								dataTestId={`${dataTestId}-confirm`}
								onClick={handleConfirm}
							/>
						</div>
					</div>
				}
			></Card>
		</Modal>
	)
})

ValidateModal.displayName = 'ValidateModal'
