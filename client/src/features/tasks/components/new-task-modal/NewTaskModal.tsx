import type { NewTaskModalProps } from './NewTaskModalProps'
import { Button, Form, Modal } from '~/components'
import styles from './NewTaskModal.module.scss'
import clsx from 'clsx'

export function NewTaskModal({ isOpen, onCreate }: NewTaskModalProps) {
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
						/>
					</div>
					<div className={clsx(styles.buttons)}>
						<Button
							text="Cancel"
							variant="glick-black"
						/>
						<Button text="Create" />
					</div>
				</div>
			</Modal>
		</div>
	)
}
