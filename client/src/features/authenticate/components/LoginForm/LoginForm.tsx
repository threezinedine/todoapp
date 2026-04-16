import { Form, Button, Modal, Card } from '~/components'
import { useState } from 'react'
import styles from './LoginForm.module.scss'
import { useAuthStore } from '~/stores'
import { useNavigate } from 'react-router-dom'

export function LoginForm() {
	const [openModal, setOpenModal] = useState(false)
	const { login } = useAuthStore()
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()

	async function handleSubmit(data: { [key: string]: string }) {
		if (!data.token) {
			setError('Token is required.')
			setOpenModal(true)
			return
		}

		const response = await login(data.token)

		if (response) {
			setError(response)
			setOpenModal(true)
		} else {
			setOpenModal(false)
			navigate('/')
		}
	}

	return (
		<>
			<Form
				dataTestId="login-form"
				fields={[
					{
						field: 'token',
						type: 'password',
					},
				]}
				submitButton={
					<Button
						variant="glick-black"
						borderRadius="none"
						size="full"
						text="Submit"
						dataTestId="login-form-submit"
					/>
				}
				onSubmit={handleSubmit}
			/>
			<Modal
				isOpen={openModal}
				onClose={() => setOpenModal(false)}
				dataTestId="login-error-modal"
			>
				<Card
					title="Login Failed"
					content={<h2 className={styles.error}>{error}</h2>}
				/>
			</Modal>
		</>
	)
}
