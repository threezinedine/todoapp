import { create } from 'zustand'
import { getTasks, getTasksOrder } from '../requests/getTasks'
import { deleteTask } from '../requests/createTask'
import { toast } from '~/stores'

export interface Task {
	taskId: string
	taskName: string
	isComplete: boolean
	isSelected: boolean
}

interface TasksState {
	tasks: Task[]
	isTasksLoading: boolean
	fetchTasks: () => Promise<void>
	completeTask?: (taskId: string) => Promise<void>
	deleteTask?: (taskId: string) => Promise<void>

	resetSelected: () => void
	selectTask?: (taskId: string, isSelected: boolean) => Promise<void>
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
						isSelected: false,
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

	completeTask: async (taskId) => {
		// optimistically update the task as completed
		set((state) => ({
			tasks: state.tasks.map((task) =>
				task.taskId === taskId ? { ...task, isComplete: true } : task,
			),
		}))
	},

	deleteTask: async (taskId) => {
		// optimistically remove the task from the list
		const response = await deleteTask(taskId)

		if (response instanceof Response) {
			if (!response.ok) {
				const errorData = await response.json()
				console.error('Failed to delete task:', errorData)
				toast.error(
					errorData?.message ||
						response.statusText ||
						'Failed to delete task',
					{
						title: 'Delete Task Failed',
					},
				)
				return
			} else {
				toast.success('Task deleted successfully!', {
					title: 'Success',
				})
			}
		} else {
			console.error('Unexpected response type:', response)
			toast.error('An unexpected error occurred while deleting task.', {
				title: 'Delete Task Error',
			})
			return
		}

		set((state) => ({
			tasks: state.tasks.filter((task) => task.taskId !== taskId),
		}))
	},

	resetSelected: () =>
		set((state) => ({
			tasks: state.tasks.map((task) => ({
				...task,
				isSelected: false,
			})),
		})),

	selectTask: async (taskId, isSelected) => {
		// optimistically update the task as selected/unselected
		set((state) => ({
			tasks: state.tasks.map((task) =>
				task.taskId === taskId ? { ...task, isSelected } : task,
			),
		}))
	},
}))
