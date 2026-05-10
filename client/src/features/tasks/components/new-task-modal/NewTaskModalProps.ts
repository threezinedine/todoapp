export interface NewTaskModalProps {
	onCreate?: (title: string) => Promise<void> | void
	isOpen: boolean
}
