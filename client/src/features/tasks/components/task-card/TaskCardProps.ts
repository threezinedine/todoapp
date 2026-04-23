export interface TaskCardProps {
	testId?: string
	taskId?: string
	taskName: string
	isComplete?: boolean
	onCompleteChange?: (isComplete: boolean) => Promise<void>
	onDelete?: () => Promise<void>
	onSettings?: () => Promise<void>
}
