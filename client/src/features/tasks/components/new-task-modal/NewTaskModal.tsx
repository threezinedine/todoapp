import { useRef } from 'react'
import type { NewTaskModalProps } from './NewTaskModalProps'
import { Button, Form, Modal } from '~/components'
import type { FormHandle } from '~/components'
import styles from './NewTaskModal.module.scss'
import clsx from 'clsx'
import type { FieldProps } from '~/components/form'
import { useTasksStore } from '../../stores/task-store'

export function NewTaskModal({
	isOpen,
	onSuccess,
	onFailed,
	onError,
	onClose,
}: NewTaskModalProps) {
	const formRef = useRef<FormHandle>(null)
	const { createTask, currentDate } = useTasksStore()

	async function onSubmit(fields: Record<string, any>) {
		if (fields.Seconds === '') {
			fields.Seconds = undefined
		}

		try {
			const response = await createTask?.(
				fields.Name,
				fields.Description,
				fields.Seconds,
			)

			if (response?.ok) {
				onSuccess?.(response)
			} else if (response) {
				onFailed?.(response)
			}
		} catch (err) {
			onError?.(err)
		}
	}

	const modalFields: FieldProps[] = [
		{
			field: 'Name',
			type: 'text',
		},
		{
			field: 'Description',
			type: 'textarea',
		},
		{
			field: 'Due Date',
			type: 'date',
			defaultValue: currentDate.toISOString().split('T')[0],
		},
	]

	if (import.meta.env.VITE_API_ENVIRONMENT === 'development') {
		modalFields.push({
			field: 'Seconds',
			type: 'number',
			defaultValue: 3,
		})
	}

	return (
		<div className={clsx(styles.container)}>
			<Modal
				isOpen={isOpen}
				dataTestId="new-task-modal"
				onClose={onClose}
			>
				<div className={clsx(styles.wrapper)}>
					<h2 className={clsx(styles.title)}>Create New Task</h2>
					<div className={clsx(styles.form)}>
						<Form
							ref={formRef}
							fields={modalFields}
							onSubmit={onSubmit}
							dataTestId={`new-task-form`}
						/>
					</div>
					<div className={clsx(styles.buttons)}>
						<Button
							text="Cancel"
							variant="glick-black"
							onClick={() => {
								formRef?.current?.reset()
								onClose?.()
							}}
						/>
						<Button
							text="Create"
							dataTestId="new-task-modal-create-btn"
							onClick={() => formRef?.current?.submit()}
						/>
					</div>
				</div>
			</Modal>
		</div>
	)
}
