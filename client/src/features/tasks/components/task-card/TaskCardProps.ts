export interface TaskCardProps {
	testId?: string
	taskId?: string
	taskName: string
	isComplete?: boolean
	onCompleteChange?: (isComplete: boolean) => Promise<void> | void
	onDelete?: () => Promise<void> | void
	onSettings?: () => Promise<void> | void
}
