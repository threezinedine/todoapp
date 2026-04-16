import React from 'react'
import type { ModalProps } from './ModalProps'
import styles from './Modal.module.scss'
import clsx from 'clsx'

export function Modal({
	children,
	isOpen,
	onClose,
	borderRadius = 'medium',
	dataTestId = undefined,
}: ModalProps) {
	function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
		if (event.target === event.currentTarget) {
			onClose?.()
		}
	}

	if (!isOpen) return null

	return (
		<div
			className={styles.modal}
			data-testid={dataTestId}
		>
			<div
				className={styles.overlay}
				onClick={handleOverlayClick}
				data-testid={dataTestId ? `${dataTestId}-overlay` : undefined}
			>
				<div
					className={clsx(
						styles.content,
						borderRadius === 'none' && styles['border-radius-none'],
						borderRadius === 'small' &&
							styles['border-radius-small'],
						borderRadius === 'medium' &&
							styles['border-radius-medium'],
						borderRadius === 'large' &&
							styles['border-radius-large'],
					)}
					data-testid={
						dataTestId ? `${dataTestId}-content` : undefined
					}
				>
					{children}
				</div>
			</div>
		</div>
	)
}
