import { useMemo, useState } from 'react'
import clsx from 'clsx'
import styles from './ViewSwitch.module.scss'
import type { ViewSwitchProps } from './ViewSwitchProps'

export function ViewSwitch<T extends string = string>({
	options,
	defaultValue,
	value,
	onValueChange,
	className,
	classNames,
}: ViewSwitchProps<T>) {
	const fallbackValue = options[0]?.value
	const [internalValue, setInternalValue] = useState<T | undefined>(
		defaultValue ?? fallbackValue,
	)

	const activeValue = value ?? internalValue ?? fallbackValue
	const activeIndex = useMemo(
		() =>
			Math.max(
				0,
				options.findIndex((option) => option.value === activeValue),
			),
		[activeValue, options],
	)

	if (options.length === 0 || activeValue === undefined) {
		return null
	}

	function handleClick(nextValue: T) {
		if (value === undefined) {
			setInternalValue(nextValue)
		}

		onValueChange?.(nextValue)
	}

	return (
		<div
			className={clsx(styles.wrapper, classNames?.wrapper, className)}
			style={{
				['--switch-count' as string]: String(options.length),
			}}
		>
			{options.map((option) => (
				<button
					type="button"
					key={option.value}
					className={clsx(styles.viewButton, classNames?.button, {
						[styles.activeButton]: activeValue === option.value,
						[classNames?.activeButton ?? '']:
							activeValue === option.value,
					})}
					onClick={() => handleClick(option.value)}
				>
					{option.label}
				</button>
			))}
			<div
				className={clsx(styles.indicator, classNames?.indicator, {
					[classNames?.indicatorByValue?.[activeValue] ?? '']:
						classNames?.indicatorByValue?.[activeValue],
				})}
				style={{
					transform: `translateX(${activeIndex * 100}%)`,
				}}
			></div>
		</div>
	)
}
