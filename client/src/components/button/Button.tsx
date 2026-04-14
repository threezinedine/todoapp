import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string
	variant?: 'normal' | 'glick' | 'background'
	size?: 'small' | 'medium' | 'large' | 'full'
	borderRadius?: 'none' | 'small' | 'medium' | 'large'
	padding?: 'none' | 'small' | 'medium' | 'large'
}

interface VariantButtonProps {
	text?: string
	classNames?: string
}

function NormalButton({
	text = 'Button',
	classNames = '',
}: VariantButtonProps) {
	return <button className={clsx(styles.normal, classNames)}>{text}</button>
}

function GlickButton({ text = 'Glick', classNames = '' }: VariantButtonProps) {
	return <button className={clsx(styles.glick, classNames)}>{text}</button>
}

export function Button({
	variant = 'normal',
	text = 'Button',
	size = 'medium',
	borderRadius = 'medium',
	padding = 'medium',
	className = '',
}: ButtonProps) {
	let sizeClass = `button-${size}`
	let borderRadiusClass = `button-radius-${borderRadius}`
	let paddingClass = `button-padding-${padding}`

	return (
		<div className={(clsx(className), styles[sizeClass])}>
			{variant === 'normal' && (
				<NormalButton
					text={text}
					classNames={clsx(
						styles.button,
						styles[sizeClass],
						styles[borderRadiusClass],
						styles[paddingClass],
					)}
				/>
			)}
			{variant === 'glick' && (
				<GlickButton
					text={text}
					classNames={clsx(
						styles.button,
						styles[sizeClass],
						styles[paddingClass],
					)}
				/>
			)}
		</div>
	)
}
