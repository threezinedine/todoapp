export interface DropMenuItem {
	icon?: React.ReactNode
	label?: string
	onClick?: () => Promise<void>
	isSeparator?: boolean
}

export interface DropMenuProps {
	items: DropMenuItem[]
	isOpen: boolean
}
