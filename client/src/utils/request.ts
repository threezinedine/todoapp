import { getToken } from './storage'

export async function get(url: string) {
	let headers = {}

	const token = await getToken()

	if (token) {
		headers = {
			Authorization: `Bearer ${token}`,
		}
	}

	const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
		headers,
	})
	return response
}

export async function post(url: string, data?: any) {
	let headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	const token = await getToken()

	if (token) {
		headers = {
			...headers,
			Authorization: `Bearer ${token}`,
		}
	}

	const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	})
	return response
}

export async function put(url: string, data?: any) {
	let headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	const token = await getToken()

	if (token) {
		headers = {
			...headers,
			Authorization: `Bearer ${token}`,
		}
	}

	const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
		method: 'PUT',
		headers,
		body: JSON.stringify(data),
	})
	return response
}

export async function del(url: string) {
	let headers: Record<string, string> = {}

	const token = await getToken()

	if (token) {
		headers = {
			Authorization: `Bearer ${token}`,
		}
	}

	const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
		method: 'DELETE',
		headers,
	})
	return response
}
