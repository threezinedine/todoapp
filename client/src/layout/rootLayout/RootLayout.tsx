import styles from './RootLayout.module.css'
import clsx from 'clsx'

export function RootLayout({ children }: { children: React.ReactNode }) {
	return <div className={clsx(styles.root)}>{children}</div>
}
