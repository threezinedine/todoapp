import { useRef } from 'react'
import type { NewTaskModalProps } from './NewTaskModalProps'
import { Button, Form, Modal } from '~/components'
import type { FormHandle } from '~/components'
import styles from './NewTaskModal.module.scss'
import clsx from 'clsx'
import { createTask } from '../../requests/createTask'

export function NewTaskModal({
	isOpen,
	onSuccess,
	onFailed,
	onError,
}: NewTaskModalProps) {
	const formRef = useRef<FormHandle>(null)

	async function onSubmit(fields: Record<string, any>) {
		//
		try {
			const res = await createTask(
				fields.Name,
				fields.Description,
				fields['Due Date'],
			)

			if (res.ok) {
				onSuccess?.(res)
				formRef.current?.reset()
			} else {
				onFailed?.(res)
			}
		} catch (err) {
			onError?.(err)
		}
	}

	return (
		<div className={clsx(styles.container)}>
			<Modal
				isOpen={isOpen}
				dataTestId="new-task-modal"
			>
				<div className={clsx(styles.wrapper)}>
					<h2 className={clsx(styles.title)}>Create New Task</h2>
					<div className={clsx(styles.form)}>
						<Form
							ref={formRef}
							fields={[
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
									defaultValue: new Date(),
								},
							]}
							onSubmit={onSubmit}
						/>
					</div>
					<div className={clsx(styles.buttons)}>
						<Button
							text="Cancel"
							variant="glick-black"
							onClick={() => formRef?.current?.reset()}
						/>
						<Button
							text="Create"
							onClick={() => formRef?.current?.submit()}
						/>
					</div>
				</div>
			</Modal>
		</div>
	)
}
