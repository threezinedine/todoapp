export interface NavbarProps {
	icon: React.ReactNode
	rightSide?: React.ReactNode
	onClickMenuToggle?: () => Promise<void>
	onIconClick?: () => Promise<void>
	onBranchClick?: () => Promise<void>
}
