import { forwardRef, useImperativeHandle, useState } from 'react'
import type { TimeModalProps, TimeModalHandle } from './TimeModalProps'
import styles from './TimeModal.module.scss'
import clsx from 'clsx'
import { Modal } from '~/components'

export const TimeModal = forwardRef<TimeModalHandle, TimeModalProps>(
	({}, ref) => {
		const [isOpen, setIsOpen] = useState(false)

		useImperativeHandle(ref, () => ({
			toggle: () => setIsOpen((prev) => !prev),
		}))

		return (
			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			>
				<div className={clsx(styles.container)}>
					<h2>Time Modal</h2>
				</div>
			</Modal>
		)
	},
)

TimeModal.displayName = 'TimeModal'
