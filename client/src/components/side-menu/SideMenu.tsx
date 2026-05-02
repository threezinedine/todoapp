import type { SideMenuProps } from './SideMenuProps'
import styles from './SideMenu.module.scss'
import clsx from 'clsx'

export function SideMenu({ isOpen = false }: SideMenuProps) {
	return (
		<div className={clsx(styles.container, { [styles.open]: isOpen })}>
			<div className={styles.sideMenu}>Side Menu</div>
			<div className={styles.overlay}></div>
		</div>
	)
}
