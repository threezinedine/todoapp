import styles from './RootLayout.module.scss'
import type { RootLayoutProps } from './RootLayoutProps'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Navbar } from '~/components'
import { Dropdown, ValidateModal } from '~/state-components'
import type { ValidateModalHandle } from '~/state-components'
import { PomodoroIcon } from '~/icons'
import { useAuthStore } from '~/stores'
import { useRef } from 'react'

export function RootLayout({
	children,
	hasNavbarRightSide = true,
}: RootLayoutProps) {
	const { isAuthenticated } = useAuthStore()
	const navigate = useNavigate()
	const validateModalRef = useRef<ValidateModalHandle>(null)

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
											validateModalRef.current?.open()
										},
									},
								]}
							>
								<Avatar
									name="John Doe"
									dataTestId="avatar"
								/>
							</Dropdown>
						) : (
							<Button
								text="Login"
								variant="glick-black"
								onClick={async () => navigate('/login')}
							/>
						))
					}
				/>
			</div>
			<div className={clsx(styles.body)}>{children}</div>
			<ValidateModal
				dataTestId="logout-validate-modal"
				ref={validateModalRef}
				content="Are you sure you want to logout?"
				onCancel={async () => {}}
				onConfirm={async () => {
					await useAuthStore.getState().logout()
					navigate('/login')
				}}
			/>
		</div>
	)
}
