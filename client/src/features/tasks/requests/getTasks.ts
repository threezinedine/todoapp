import { get } from '~/utils'

export function getTasks(date?: Date) {
	const dateParam = date ? `date=${date.toISOString()}` : ''

	return get(`/tasks?${dateParam}`)
}
