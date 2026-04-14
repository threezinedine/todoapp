import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string | React.ReactNode
	variant?: 'normal' | 'glick' | 'glick-black' | 'glass-morphism' | 'glint'
	size?: 'small' | 'medium' | 'large' | 'full'
	borderRadius?: 'none' | 'small' | 'medium' | 'large'
	padding?: 'none' | 'small' | 'medium' | 'large'
	icon?: React.ReactNode
	onClick?: () => Promise<void>
	dataTestId?: string
}

export interface VariantButtonProps {
	dataTestId?: string
	text?: string | React.ReactNode
	classNames?: string
	onClick?: () => Promise<void>
}

export interface IconVariantButtonProps extends VariantButtonProps {
	icon: React.ReactNode
}
