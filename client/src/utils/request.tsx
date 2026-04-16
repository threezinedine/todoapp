export async function get(url: string) {
	const response = await fetch(`${process.env.VITE_API_URL}${url}`)
	return response.json()
}

export async function post(url: string, data: any) {
	const response = await fetch(`${process.env.VITE_API_URL}${url}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	return response.json()
}

export async function put(url: string, data: any) {
	const response = await fetch(`${process.env.VITE_API_URL}${url}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	return response.json()
}

export async function del(url: string) {
	const response = await fetch(`${process.env.VITE_API_URL}${url}`, {
		method: 'DELETE',
	})
	return response.json()
}
