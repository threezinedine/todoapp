export interface ValidateModalProps {
	icon?: React.ReactNode
	content: string
	onCancel: () => Promise<void>
	onConfirm: () => Promise<void>
}
