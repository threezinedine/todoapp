import { useRef } from 'react'
import type { NewTaskModalProps } from './NewTaskModalProps'
import { Button, Form, Modal } from '~/components'
import type { FormHandle } from '~/components'
import styles from './NewTaskModal.module.scss'
import clsx from 'clsx'

export function NewTaskModal({ isOpen }: NewTaskModalProps) {
	const formRef = useRef<FormHandle>(null)

	function onSubmit(fields: Record<string, any>) {
		//
		formRef.current?.reset()
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
