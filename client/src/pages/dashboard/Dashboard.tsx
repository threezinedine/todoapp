import styles from './Dashboard.module.scss'
import clsx from 'clsx'

export const Dashboard = () => {
	return (
		<div className={clsx(styles.dashboard)}>
			<h1>Dashboard</h1>
		</div>
	)
}
