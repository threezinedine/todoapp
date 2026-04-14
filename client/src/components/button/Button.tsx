import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string | React.ReactNode
	variant?: 'normal' | 'glick' | 'glass-morphism' | 'glint'
	size?: 'small' | 'medium' | 'large' | 'full'
	borderRadius?: 'none' | 'small' | 'medium' | 'large'
	padding?: 'none' | 'small' | 'medium' | 'large'
	icon?: React.ReactNode
}

interface VariantButtonProps {
	text?: string | React.ReactNode
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

function GlassMorphismButton({
	text = 'Glass',
	classNames = '',
}: VariantButtonProps) {
	return (
		<button className={clsx(styles['glass-morphism'], classNames)}>
			{text}
		</button>
	)
}

interface IconVariantButtonProps extends VariantButtonProps {
	icon: React.ReactNode
}

function GlintButton({
	text = 'Glint',
	classNames = '',
	icon,
}: IconVariantButtonProps) {
	return (
		<button className={clsx(styles.glint, classNames)}>
			<div className={styles.logo}>{icon}</div>
			<div className={styles.text}>{text}</div>
		</button>
	)
}

export function Button({
	variant = 'normal',
	text = 'Button',
	size = 'medium',
	borderRadius = 'medium',
	padding = 'medium',
	icon = null,
	className = '',
}: ButtonProps) {
	let finalVariant = variant
	let iconVariants = ['glint']

	if (icon && !iconVariants.includes(variant)) {
		finalVariant = 'glint'
	}

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
			{variant === 'glass-morphism' && (
				<GlassMorphismButton
					text={text}
					classNames={clsx(
						styles.button,
						styles[sizeClass],
						styles[borderRadiusClass],
						styles[paddingClass],
					)}
				/>
			)}
			{finalVariant === 'glint' && (
				<GlintButton
					text={text}
					icon={icon}
					classNames={clsx(
						styles.button,
						styles[borderRadiusClass],
						styles[paddingClass],
					)}
				/>
			)}
		</div>
	)
}
