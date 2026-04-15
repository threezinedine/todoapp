export interface ModalProps {
	children: React.ReactNode
	isOpen: boolean
	onClose?: () => void
	borderRadius?: 'none' | 'small' | 'medium' | 'large'
	dataTestId?: string
}
