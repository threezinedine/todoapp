export interface ValidateModalHandle {
	open: () => void
	close: () => void
	toggle: () => void
}

export interface ValidateModalProps {
	icon?: React.ReactNode
	content: string
	onCancel: () => Promise<void>
	onConfirm: () => Promise<void>
	dataTestId?: string
}
