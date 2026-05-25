export interface DropMenuItem {
	icon?: React.ReactNode
	label?: string
	onClick?: () => Promise<void> | void
	isSeparator?: boolean
	testId?: string
}

export interface DropMenuProps {
	items: DropMenuItem[]
	isOpen: boolean
}
