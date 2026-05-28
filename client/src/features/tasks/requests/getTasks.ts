import { get } from '~/utils'

export function getTasks(date?: Date) {
	// get date part only in ISO string
	const dateParam = date ? `date=${date.toISOString().split('T')[0]}` : ''

	return get(`/tasks?${dateParam}`)
}

export function getTasksOrder(date?: Date) {
	const dateParam = date ? `date=${date.toISOString().split('T')[0]}` : ''

	return get(`/tasks/orders?${dateParam}`)
}
