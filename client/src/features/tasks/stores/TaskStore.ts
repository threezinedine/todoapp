import { create } from 'zustand'
import { getTasks } from '../requests/getTasks'

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
			if (data instanceof Response) {
				if (!data.ok) {
					const errorData = await data.json()
					console.error('Failed to fetch tasks:', errorData)
					return
				}
				// sleep for 2 seconds to show loading state
				await new Promise((resolve) => setTimeout(resolve, 200))
				const tasksData = await data.json()

				const finalTasks = []
				for (const task of tasksData.tasks) {
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
