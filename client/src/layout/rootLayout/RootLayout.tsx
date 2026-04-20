import styles from './RootLayout.module.scss'
import type { RootLayoutProps } from './RootLayoutProps'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Navbar } from '~/components'
import { Dropdown } from '~/features/dropdown/components/dropdown/Dropdown'
import { PomodoroIcon } from '~/icons'
import { useAuthStore } from '~/stores'

export function RootLayout({
	children,
	hasNavbarRightSide = true,
}: RootLayoutProps) {
	const { isAuthenticated } = useAuthStore()
	const navigate = useNavigate()

	return (
		<div className={clsx(styles.wrapper)}>
			<div className={styles.navbar}>
				<Navbar
					onIconClick={async () => navigate('/')}
					onBranchClick={async () => navigate('/')}
					icon={<PomodoroIcon />}
					rightSide={
						hasNavbarRightSide &&
						(isAuthenticated ? (
							<Dropdown
								items={[
									{
										label: 'Profile',
										onClick: async () => {
											navigate('/profile')
										},
									},
									{
										isSeparator: true,
									},
									{
										label: 'Logout',
										onClick: async () => {
											navigate('/login')
										},
									},
								]}
							>
								<Avatar name="John Doe" />
							</Dropdown>
						) : (
							<Button
								text="Login"
								variant="glick-black"
							/>
						))
					}
				/>
			</div>
			<div className={clsx(styles.body)}>{children}</div>
		</div>
	)
}
