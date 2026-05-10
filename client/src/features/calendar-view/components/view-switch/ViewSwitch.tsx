import { useState } from 'react'
import styles from './ViewSwitch.module.scss'
import clsx from 'clsx'
import type { ViewSwitchProps } from './ViewSwitchPropts'

export function ViewSwitch({
	defaultView = 'day',
	onViewChange,
}: ViewSwitchProps) {
	const [activeView, setActiveView] = useState<'day' | 'week' | 'month'>(
		defaultView,
	)

	function handleViewChange(view: 'day' | 'week' | 'month') {
		setActiveView(view)
		onViewChange?.(view)
	}

	return (
		<div className={clsx(styles.wrapper)}>
			<div
				className={clsx(styles.viewButton, {
					[styles.activeButton]: activeView === 'day',
				})}
				onClick={() => handleViewChange('day')}
			>
				Day
			</div>
			<div
				className={clsx(styles.viewButton, {
					[styles.activeButton]: activeView === 'week',
				})}
				onClick={() => handleViewChange('week')}
			>
				Week
			</div>
			<div
				className={clsx(styles.viewButton, {
					[styles.activeButton]: activeView === 'month',
				})}
				onClick={() => handleViewChange('month')}
			>
				Month
			</div>
			<div
				className={clsx(styles.indicator, {
					[styles['day-active']]: activeView === 'day',
					[styles['week-active']]: activeView === 'week',
					[styles['month-active']]: activeView === 'month',
				})}
			></div>
		</div>
	)
}
