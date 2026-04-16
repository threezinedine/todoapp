import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { post } from '~/utils'
import { setToken } from '~/utils'

export interface User {}

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	verify: () => Promise<string | null>
	login: (token: string) => Promise<string | null>
	logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,

			verify: async () => {
				// get token from state
				const response = await post('/auth/verify', {})

				if (!response.ok) {
					set({
						user: null,
						isAuthenticated: false,
					})
					return (
						response.statusText ||
						'Token verification failed. Please login again.'
					)
				}

				return null
			},

			login: async (token: string) => {
				await setToken(token)
				const response = await post('/auth/verify', {})

				if (!response.ok) {
					return (
						response.statusText || 'Login failed. Please try again.'
					)
				}

				set({
					user: null,
					isAuthenticated: true,
				})
				return null
			},

			logout: async () => {
				await setToken(null)

				set({
					user: null,
					isAuthenticated: false,
				})
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
)
