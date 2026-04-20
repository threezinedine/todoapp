import { LoginCard } from '~/features/authenticate'
import styles from './Login.module.scss'
import clsx from 'clsx'

export function Login() {
	return (
		<div className={clsx(styles.container)}>
			<div className={clsx(styles.internal)}>
				<LoginCard />
			</div>
		</div>
	)
}
