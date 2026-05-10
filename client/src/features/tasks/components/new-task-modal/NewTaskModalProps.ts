export interface NewTaskModalProps {
	onCreate?: (response: Response) => Promise<void> | void
	onFailed?: (response: Response) => Promise<void> | void
	isOpen: boolean
}
