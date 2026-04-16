import type { TooltipProps } from './TooltipProps'
import styles from './Tooltip.module.scss'
import clsx from 'clsx'

export function Tooltip({ content, position = 'top', children }: TooltipProps) {
	return (
		<div className={styles.tooltip}>
			<div className={clsx(styles.tooltiptext, styles[position])}>
				{content}
			</div>
			<div className={styles.component}>{children}</div>
		</div>
	)
}
