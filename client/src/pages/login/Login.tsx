import { LoginCard } from '~/features/authenticate'
import styles from './Login.module.scss'
import clsx from 'clsx'

export function Login() {
	return (
		<div className={clsx(styles.container)}>
			<LoginCard />
		</div>
	)
}
