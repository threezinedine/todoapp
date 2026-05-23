import { get } from '~/utils'

export function getTasks(date?: Date) {
	const dateParam = date ? `date=${date.toISOString()}` : ''

	return get(`/tasks?${dateParam}`)
}

export function getTasksOrder(date?: Date) {
	const dateParam = date ? `date=${date.toISOString()}` : ''

	return get(`/tasks/orders?${dateParam}`)
}
