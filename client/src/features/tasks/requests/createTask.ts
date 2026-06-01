import { post, del, patch } from '~/utils'

export function createTask(
	title: string,
	description?: string,
	dueDate?: Date,
	seconds?: number,
) {
	return post('/tasks', {
		name: title,
		description,
		due_date: dueDate?.toISOString().split('T')[0],
		seconds,
	})
}

export function deleteTask(id: string) {
	return del(`/tasks/${id}`)
}

export function reorderTasks(taskIds: string[], date: Date) {
	return patch('/tasks/orders', {
		order_task_ids: taskIds,
		date: date.toISOString().split('T')[0],
	})
}
