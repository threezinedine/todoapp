import { create } from 'zustand'
import { getTasks, getTasksOrder } from '../requests/getTasks'
import { createTask, deleteTask, reorderTasks } from '../requests/createTask'
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
	fetchTasks: (date?: Date) => Promise<void>
	currentDate: Date
	completeTask?: (taskId: string) => Promise<void>
	deleteTask?: (taskId: string) => Promise<void>

	resetSelected: () => void
	selectTask?: (taskId: string, isSelected: boolean) => Promise<void>
	createTask?: (
		title: string,
		description?: string,
		seconds?: number,
	) => Promise<Response>
	moveTask: (
		taskId: string,
		targetTaskId: string,
		position: 'above' | 'below',
	) => Promise<void>
}

export const useTasksStore = create<TasksState>()((set) => ({
	tasks: [],
	isTasksLoading: false,
	currentDate: new Date(),
	fetchTasks: async (date) => {
		if (!date) {
			date = new Date()
		}
		set({ currentDate: date })

		set({ isTasksLoading: true })
		try {
			const data = await getTasks(date)
			const orderData = await getTasksOrder(date)

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

	createTask: async (title, description, seconds) => {
		const response = await createTask(
			title,
			description,
			useTasksStore.getState().currentDate,
			seconds,
		)

		if (response instanceof Response) {
			if (!response.ok) {
				const errorData = await response.json()
				console.error('Failed to create task:', errorData)
				toast.error(
					errorData?.message ||
						response.statusText ||
						'Failed to create task',
					{
						title: 'Create Task Failed',
					},
				)
				return response
			} else {
				toast.success('Task created successfully!', {
					title: 'Success',
				})
			}
		} else {
			console.error('Unexpected response type:', response)
			toast.error('An unexpected error occurred while creating task.', {
				title: 'Create Task Error',
			})
			throw new Error('Unexpected response type')
		}

		// refetch tasks after creating a new one
		await useTasksStore
			.getState()
			.fetchTasks(useTasksStore.getState().currentDate)

		return response
	},
	moveTask: async (taskId, targetTaskId, position) => {
		// move the task in the local state optimistically
		const tasks = useTasksStore.getState().tasks
		const newTasks: Task[] = []

		function getTaskName(id: string) {
			return (
				tasks.find((t) => t.taskId === id)?.taskName ?? 'Unknown Task'
			)
		}

		console.log(
			'Moving task',
			getTaskName(taskId),
			'to',
			position,
			'of',
			getTaskName(targetTaskId),
		)

		for (const task of tasks) {
			console.log(
				task.taskName,
				getTaskName(taskId),
				getTaskName(targetTaskId),
			)
			if (task.taskId !== taskId && task.taskId !== targetTaskId) {
				newTasks.push(task)
				console.log('pushing task', task.taskName)
			} else {
				if (task.taskId === targetTaskId) {
					if (position === 'above') {
						newTasks.push({
							...tasks.find((t) => t.taskId === taskId)!,
						})
						console.log('pushing task', getTaskName(taskId))
						newTasks.push(task)
						console.log('pushing task', task.taskName)
					} else {
						newTasks.push(task)
						console.log('pushing task', task.taskName)
						newTasks.push({
							...tasks.find((t) => t.taskId === taskId)!,
						})
						console.log('pushing task', getTaskName(taskId))
					}
				}
			}
		}

		try {
			reorderTasks(
				newTasks.map((t) => t.taskId),
				useTasksStore.getState().currentDate,
			)
		} catch (error) {
			console.error('Failed to reorder tasks:', error)
			toast.error('Failed to reorder tasks. Please try again.', {
				title: 'Reorder Tasks Failed',
			})
			return
		}

		toast.success('Tasks reordered successfully!', {
			title: 'Success',
		})
		set({ tasks: newTasks })
	},
}))
