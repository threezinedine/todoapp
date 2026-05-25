import type { TaskCardProps } from './TaskCardProps'
import styles from './TaskCard.module.scss'
import clsx from 'clsx'
import {
	DragHandleIcon,
	CheckMarkIcon,
	OptionIcon,
	SettingsIcon,
	DeleteIcon,
} from '~/icons'
import {
	Dropdown,
	ValidateModal,
	type ValidateModalHandle,
} from '~/state-components'
import { useRef } from 'react'

export function TaskCard({
	testId,
	taskName,
	variant = 'default',
	isComplete = false,
	isSelected = false,
	onCompleteChange,
	onSelectedChange,
	onDelete,
	onSettings,
	onOpenPomodoro,
}: TaskCardProps) {
	const isNameSelectVariant = variant === 'name-select'
	const isChecked = isNameSelectVariant ? isSelected : isComplete
	const deleteModalRef = useRef<ValidateModalHandle>(null)

	const handleCompleteChange = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (isNameSelectVariant) {
			void onSelectedChange?.(!isSelected)
			return
		}

		void onCompleteChange?.(!isComplete)
	}

	const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()

		if (isNameSelectVariant) {
			void onSelectedChange?.(!isSelected)
			return
		}

		void onOpenPomodoro?.()
	}

	const handleNameClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isNameSelectVariant) return

		handleCompleteChange(e)
	}

	const containerRef = useRef<HTMLDivElement>(null)

	return (
		<div
			data-testid={testId}
			className={clsx(styles.container, {
				[styles.selectedTask]: isNameSelectVariant && isSelected,
			})}
			ref={containerRef}
			onClick={handleCardClick}
		>
			<input
				type="checkbox"
				checked={isChecked}
				data-testid={`${testId}-checkbox`}
				readOnly
			/>
			<div
				className={clsx({
					[styles.content]: true,
					[styles.nameSelect]: isNameSelectVariant,
					[styles.completed]: isComplete,
					[styles.selected]: isNameSelectVariant && isSelected,
				})}
			>
				<div
					className={clsx(styles.icon, {
						[styles.collapsed]: isNameSelectVariant,
					})}
					onClick={(event) => event.stopPropagation()}
					draggable={!isNameSelectVariant}
					onDragStart={() => {
						if (isNameSelectVariant) return

						if (containerRef.current) {
							containerRef.current.classList.add(styles.dragging)
						}
					}}
					onDragEnd={() => {
						if (isNameSelectVariant) return

						if (containerRef.current) {
							containerRef.current.classList.remove(
								styles.dragging,
							)
						}
					}}
				>
					<DragHandleIcon />
				</div>
				<div
					className={clsx(styles.checkbox)}
					onClick={handleCompleteChange}
				>
					<div className={clsx(styles.rect)}></div>
					<div className={clsx(styles.mark)}>
						<CheckMarkIcon />
					</div>
				</div>
				<div
					className={clsx(styles.name)}
					onClick={handleNameClick}
				>
					{taskName}
				</div>
			</div>
			<div
				className={clsx(styles.option, {
					[styles.collapsed]: isNameSelectVariant,
				})}
				data-testid={`${testId}-option`}
				onClick={(e) => {
					if (isNameSelectVariant) {
						return
					}

					e.stopPropagation()
				}}
			>
				<Dropdown
					items={[
						{
							icon: <SettingsIcon />,
							label: 'Setting',
							testId: `${testId}-settings`,
							onClick: async () => {
								await onSettings?.()
							},
						},
						{
							icon: <DeleteIcon />,
							label: 'Delete',
							testId: `${testId}-delete`,
							onClick: async () => {
								deleteModalRef.current?.open()
							},
						},
					]}
				>
					<OptionIcon />
				</Dropdown>
				<ValidateModal
					content="Do you wanna delete the task"
					ref={deleteModalRef}
					dataTestId={`${testId}-delete-validate-modal`}
					onCancel={() => {}}
					onConfirm={() => {
						console.log('Task deleted')
						onDelete?.()
					}}
				/>
			</div>
		</div>
	)
}
