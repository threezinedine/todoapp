import { post } from '~/utils'

export function createTask(
	title: string,
	description?: string,
	dueDate?: Date,
) {
	return post('/tasks', { name: title, description, due_date: dueDate })
}
