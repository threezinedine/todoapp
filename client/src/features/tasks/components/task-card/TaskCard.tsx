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
import { Dropdown } from '~/state-components'
import { useRef } from 'react'

export function TaskCard({
	testId,
	taskName,
	isComplete = false,
	onCompleteChange,
	onDelete,
	onSettings,
}: TaskCardProps) {
	const handleCompleteChange = () => {
		void onCompleteChange?.(!isComplete)
	}

	const containerRef = useRef<HTMLDivElement>(null)

	return (
		<div
			data-testid={testId}
			className={clsx(styles.container)}
			ref={containerRef}
		>
			<input
				type="checkbox"
				checked={isComplete}
				readOnly
			/>
			<div
				className={clsx({
					[styles.content]: true,
					[styles.completed]: isComplete,
				})}
				onClick={handleCompleteChange}
			>
				<div
					className={clsx(styles.icon)}
					onClick={(event) => event.stopPropagation()}
					draggable={true}
					onDragStart={() => {
						if (containerRef.current) {
							containerRef.current.classList.add(styles.dragging)
						}
					}}
					onDragEnd={() => {
						if (containerRef.current) {
							containerRef.current.classList.remove(
								styles.dragging,
							)
						}
					}}
				>
					<DragHandleIcon />
				</div>
				<div className={clsx(styles.checkbox)}>
					<div className={clsx(styles.rect)}></div>
					<div className={clsx(styles.mark)}>
						<CheckMarkIcon />
					</div>
				</div>
				<div className={clsx(styles.name)}>{taskName}</div>
			</div>
			<div className={clsx(styles.option)}>
				<Dropdown
					items={[
						{
							icon: <SettingsIcon />,
							label: 'Setting',
							onClick: async () => {
								await onSettings?.()
							},
						},
						{
							icon: <DeleteIcon />,
							label: 'Delete',
							onClick: async () => {
								await onDelete?.()
							},
						},
					]}
				>
					<OptionIcon />
				</Dropdown>
			</div>
		</div>
	)
}
