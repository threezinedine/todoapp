import styles from './Button.module.scss'
import clsx from 'clsx'
import type {
	VariantButtonProps,
	ButtonProps,
	IconVariantButtonProps,
} from './ButtonProps'

function NormalButton({
	text = 'Button',
	classNames = '',
	onClick = undefined,
	dataTestId = undefined,
}: VariantButtonProps) {
	return (
		<button
			className={clsx(styles.normal, classNames)}
			onClick={onClick}
			data-testid={dataTestId}
		>
			{text}
		</button>
	)
}

function GlickButton({
	text = 'Glick',
	classNames = '',
	onClick = undefined,
	dataTestId = undefined,
}: VariantButtonProps) {
	return (
		<button
			className={clsx(styles.glick, classNames)}
			onClick={onClick}
			data-testid={dataTestId}
		>
			{text}
		</button>
	)
}

function GlassMorphismButton({
	text = 'Glass',
	classNames = '',
	onClick = undefined,
	dataTestId = undefined,
}: VariantButtonProps) {
	return (
		<button
			className={clsx(styles['glass-morphism'], classNames)}
			onClick={onClick}
			data-testid={dataTestId}
		>
			{text}
		</button>
	)
}

function GlintButton({
	text = 'Glint',
	classNames = '',
	icon,
	onClick = undefined,
	dataTestId = undefined,
}: IconVariantButtonProps) {
	return (
		<button
			className={clsx(styles.glint, classNames)}
			onClick={onClick}
			data-testid={dataTestId}
		>
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
	...rest
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
					{...rest}
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
					{...rest}
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
					{...rest}
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
					{...rest}
				/>
			)}
		</div>
	)
}
