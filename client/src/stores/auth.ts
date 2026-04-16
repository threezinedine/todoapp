import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { post } from '~/utils/request'

export interface User {}

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	token: string | null
	verify: () => Promise<boolean>
	login: (token: string) => Promise<boolean>
	logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			token: null,

			verify: async () => {
				// get token from state
				if (!get().token) {
					return false
				}

				const response = await post('/auth/verify', {
					token: get().token,
				})

				if (!response.success) {
					set({
						user: null,
						token: null,
						isAuthenticated: false,
					})
					return false
				}

				return true
			},

			login: async (token: string) => {
				const response = await post('/auth/verify', { token })

				if (!response.success) {
					return false
				}

				set({
					user: null,
					token,
					isAuthenticated: true,
				})
				return true
			},

			logout: async () => {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				})
			},

			setToken: (token: string) => set({ token }),
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
)
