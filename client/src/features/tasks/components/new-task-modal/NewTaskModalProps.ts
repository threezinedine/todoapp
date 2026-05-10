export interface NewTaskModalProps {
	onSuccess?: (response: Response) => Promise<void> | void
	onFailed?: (response: Response) => Promise<void> | void
	onError?: (error: any) => Promise<void> | void
	isOpen: boolean
}
