const TOKEN_KEY = 'auth-token'

export function getToken(): Promise<string | null> {
	return Promise.resolve(localStorage.getItem(TOKEN_KEY))
}

export function setToken(token: string | null): Promise<void> {
	if (token === null) {
		localStorage.removeItem(TOKEN_KEY)
		return Promise.resolve()
	}

	localStorage.setItem(TOKEN_KEY, token)
	return Promise.resolve()
}
