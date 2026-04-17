import type { NavbarProps } from './NavbarProps'
import styles from './Navbar.module.scss'

export function Navbar({ icon, rightSide }: NavbarProps) {
	return (
		<div className={styles.navbar}>
			<div className={styles['left-side']}>
				<div className={styles.logo}>{icon}</div>
				<div className={styles.branch}>TodoApp</div>
			</div>
			<div className={styles['right-side']}>{rightSide}</div>
		</div>
	)
}
