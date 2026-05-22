import type { TaskCardProps } from '../task-card/TaskCardProps'

export interface TasksListProps {
	testId?: string
	isLoading?: boolean
	tasks: TaskCardProps[]
	onTaskOpen?: (taskId: string) => Promise<void> | void
	onTaskReorder?: (
		sourceTaskId: string,
		targetTaskId: string,
		position: 'above' | 'below',
	) => Promise<void> | void
}
