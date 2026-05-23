import { create } from 'zustand'
import { getTasks, getTasksOrder } from '../requests/getTasks'

export interface Task {
	taskId: string
	taskName: string
	isComplete: boolean
}

interface TasksState {
	tasks: Task[]
	isTasksLoading: boolean
	fetchTasks: () => Promise<void>
}

export const useTasksStore = create<TasksState>()((set) => ({
	tasks: [],
	isTasksLoading: false,
	fetchTasks: async () => {
		set({ isTasksLoading: true })
		try {
			const data = await getTasks()
			const orderData = await getTasksOrder()

			if (data instanceof Response && orderData instanceof Response) {
				if (!data.ok || !orderData.ok) {
					const errorData = await data.json()
					console.error('Failed to fetch tasks:', errorData)
					return
				}
				const tasksData = await data.json()
				const orderDataJson = await orderData.json()

				// assert orderData has taskIds array which matches tasksData.tasks

				const finalTasks = []
				for (const taskId of orderDataJson.order_task_ids) {
					// for (const task of tasksData.tasks) {
					const task = tasksData.tasks.find(
						(t: any) => t.id === taskId,
					)
					if (!task) {
						console.warn(
							`Task with id ${taskId} from order data not found in tasks data`,
						)
						continue
					}

					finalTasks.push({
						taskId: task.id,
						taskName: task.name,
						isComplete: task.completed,
					})
				}

				set({ tasks: finalTasks })
			} else {
				console.error('Unexpected response type:', data)
			}
			// set({ tasks: data })
		} catch (error) {
			console.error('Error fetching tasks:', error)
		} finally {
			set({ isTasksLoading: false })
		}
	},
}))
