import { post } from '~/utils'

export function createTask(
	title: string,
	description?: string,
	dueDate?: Date,
	seconds?: number,
) {
	return post('/tasks', {
		name: title,
		description,
		due_date: dueDate,
		seconds,
	})
}
