export interface TaskCardProps {
	testId?: string
	taskId?: string
	taskName: string
	variant?: 'default' | 'name-select'
	isComplete?: boolean
	isSelected?: boolean
	onCompleteChange?: (isComplete: boolean) => Promise<void> | void
	onSelectedChange?: (isSelected: boolean) => Promise<void> | void
	onDelete?: () => Promise<void> | void
	onSettings?: () => Promise<void> | void
	onOpenPomodoro?: () => Promise<void> | void
}
