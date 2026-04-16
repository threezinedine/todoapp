import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '~/stores'
import type { AuthenProps } from './AuthenProps'

export function AuthenRoute({ children, fallback = undefined }: AuthenProps) {
	const { isAuthenticated, verify } = useAuthStore()
	const navigate = useNavigate()

	useEffect(() => {
		console.log('Checking authentication...', isAuthenticated)

		if (!isAuthenticated) {
			navigate(fallback || '/')
		} else {
			verify().then((valid) => {
				if (valid) {
					navigate(fallback || '/')
				}
			})
		}
	}, [])

	return <>{children}</>
}
