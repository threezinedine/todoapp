import type { NavbarProps } from './NavbarProps'
import styles from './Navbar.module.scss'
import { MenuToggle } from '../menu-toggle'

export function Navbar({
	icon,
	rightSide,
	onClickMenuToggle,
	onIconClick,
	onBranchClick,
}: NavbarProps) {
	return (
		<div className={styles.navbar}>
			<div className={styles['left-side']}>
				<div className={styles['menu-toggle']}>
					<MenuToggle
						isOpen={false}
						onClick={() => onClickMenuToggle?.()}
					/>
				</div>
				<div
					className={styles.logo}
					onClick={onIconClick}
				>
					{icon}
				</div>
				<div
					className={styles.branch}
					onClick={onBranchClick}
				>
					TodoApp
				</div>
			</div>
			<div className={styles['right-side']}>{rightSide}</div>
		</div>
	)
}
