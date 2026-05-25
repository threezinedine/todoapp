import type { TaskCardProps } from '../task-card/TaskCardProps'

export interface TasksListProps {
	testId?: string
	isLoading?: boolean
	variant?: 'default' | 'name-select'
	tasks: TaskCardProps[]
	onTaskOpen?: (taskId: string) => Promise<void> | void
	onTaskSelectedChange?: (
		taskId: string,
		isSelected: boolean,
	) => Promise<void> | void
	onTaskReorder?: (
		sourceTaskId: string,
		targetTaskId: string,
		position: 'above' | 'below',
	) => Promise<void> | void
	onTaskDelete?: (taskId: string) => Promise<void> | void
}
