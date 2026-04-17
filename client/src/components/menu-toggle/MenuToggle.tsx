import styles from './MenuToggle.module.scss'
import type { MenuToggleProps } from './MenuToggleProps'
import clsx from 'clsx'

export function MenuToggle({ isOpen, onClick, dataTestId }: MenuToggleProps) {
	return (
		<div
			onClick={onClick}
			data-testid={dataTestId}
			className={clsx(styles.container)}
		>
			<div className={styles.bars}>
				<div
					className={clsx(styles.bar1, {
						[styles['is-open']]: isOpen,
					})}
				></div>
				<div
					className={clsx(styles.bar2, {
						[styles['is-open']]: isOpen,
					})}
				></div>
				<div
					className={clsx(styles.bar3, {
						[styles['is-open']]: isOpen,
					})}
				></div>
			</div>
		</div>
	)
}
