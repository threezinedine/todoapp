export interface ValidateModalHandle {
	open: () => void
	close: () => void
	toggle: () => void
}

export interface ValidateModalProps {
	icon?: React.ReactNode
	content: string
	onCancel: () => Promise<void> | void
	onConfirm: () => Promise<void> | void
	dataTestId?: string
}
