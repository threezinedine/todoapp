import { Card } from '~/components'
import { LoginForm } from '../LoginForm'

export function LoginCard() {
	return (
		<Card
			title="Login"
			content={<LoginForm />}
		/>
	)
}
