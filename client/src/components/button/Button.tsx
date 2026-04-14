import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string
	variant?: 'normal' | 'film' | 'background'
	size?: 'small' | 'medium' | 'large' | 'full'
	borderRadius?: 'none' | 'small' | 'medium' | 'large'
	padding?: 'none' | 'small' | 'medium' | 'large'
}

interface NormalButtonProps {
	text?: string
	classNames?: string
}

function NormalButton({ text = 'Button', classNames = '' }: NormalButtonProps) {
	return <button className={clsx(styles.normal, classNames)}>{text}</button>
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
						styles[sizeClass],
						styles[borderRadiusClass],
						styles[paddingClass],
					)}
				/>
			)}
		</div>
	)
}
