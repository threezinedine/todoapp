import type { DropMenuProps } from './DropMenuProps'
import styles from './DropMenu.module.scss'
import clsx from 'clsx'

export function DropMenu({ items, isOpen }: DropMenuProps) {
	return (
		<div className={clsx(styles.wrapper, isOpen && styles.open)}>
			<div className={clsx(styles.menu)}>
				{items.map((item, index) =>
					item.isSeparator ? (
						<div
							key={index}
							className={styles['menu-separator']}
						/>
					) : (
						<div
							key={index}
							className={clsx(styles['menu-item'])}
							onMouseDown={item.onClick}
						>
							<label className={styles['menu-item-label']}>
								{item.icon && (
									<span
										className={clsx(
											styles['menu-item-icon'],
										)}
									>
										{item.icon}
									</span>
								)}
								<span
									className={styles['menu-item-label-text']}
								>
									{item.label}
								</span>
							</label>
						</div>
					),
				)}
			</div>
		</div>
	)
}
