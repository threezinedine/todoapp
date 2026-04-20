import { useState } from 'react'
import type { ValidateModalProps } from './ValidateModalProps'
import { Modal, Card, Button } from '~/components'
import styles from './ValidateModal.module.scss'
import clsx from 'clsx'

export function ValidateModal({
	icon,
	content,
	onCancel,
	onConfirm,
}: ValidateModalProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
		>
			<Card
				title="Confirm"
				icon={icon}
				content={
					<div className={clsx(styles.container)}>
						<p className={clsx(styles.content)}>{content}</p>
						<div className={clsx(styles.buttons)}>
							<Button
								text="Cancel"
								onClick={onCancel}
								variant="glick-black"
							/>
							<Button
								variant="glick"
								text="Confirm"
								onClick={onConfirm}
							/>
						</div>
					</div>
				}
			></Card>
		</Modal>
	)
}
