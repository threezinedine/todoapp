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
	isLoading,
}: VariantButtonProps) {
	return (
		<button
			className={clsx(styles.normal, classNames)}
			onClick={onClick}
			data-testid={dataTestId}
			disabled={isLoading}
		>
			<span>{text}</span>
			{isLoading && <div className={styles.spinner}></div>}
			{isLoading && <div className={styles.overlay}></div>}
		</button>
	)
}

function GlickButton({
	text = 'Glick',
	classNames = '',
	onClick = undefined,
	dataTestId = undefined,
	isLoading,
}: VariantButtonProps) {
	return (
		<button
			className={clsx(styles.glick, classNames)}
			onClick={onClick}
			data-testid={dataTestId}
			disabled={isLoading}
		>
			<span>{text}</span>
			{isLoading && <div className={styles.spinner}></div>}
			{isLoading && <div className={styles.overlay}></div>}
		</button>
	)
}

function GlickBlackButton({
	text = 'Glick',
	classNames = '',
	onClick = undefined,
	dataTestId = undefined,
	isLoading,
}: VariantButtonProps) {
	return (
		<button
			className={clsx(styles['glick-black'], classNames)}
			onClick={onClick}
			data-testid={dataTestId}
			data-text={text}
			disabled={isLoading}
		>
			<span>{text}</span>
			{isLoading && <div className={styles.spinner}></div>}
			{isLoading && <div className={styles.overlay}></div>}
		</button>
	)
}

function GlassMorphismButton({
	text = 'Glass',
	classNames = '',
	onClick = undefined,
	dataTestId = undefined,
	isLoading,
}: VariantButtonProps) {
	return (
		<button
			className={clsx(styles['glass-morphism'], classNames)}
			onClick={onClick}
			data-testid={dataTestId}
			disabled={isLoading}
		>
			<span>{text}</span>
			{isLoading && <div className={styles.spinner}></div>}
			{isLoading && <div className={styles.overlay}></div>}
		</button>
	)
}

function GlintButton({
	text = 'Glint',
	classNames = '',
	icon,
	onClick = undefined,
	dataTestId = undefined,
	isLoading,
}: IconVariantButtonProps) {
	return (
		<button
			className={clsx(styles.glint, classNames)}
			onClick={onClick}
			data-testid={dataTestId}
			disabled={isLoading}
		>
			<div className={styles.logo}>{icon}</div>
			<div className={styles.text}>{text}</div>
			{isLoading && <div className={styles.spinner}></div>}
			{isLoading && <div className={styles.overlay}></div>}
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
			{finalVariant === 'normal' && (
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
			{finalVariant === 'glick' && (
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
			{finalVariant === 'glass-morphism' && (
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
			{finalVariant === 'glick-black' && (
				<GlickBlackButton
					text={text}
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
