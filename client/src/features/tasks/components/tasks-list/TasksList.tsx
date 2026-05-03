import type { TasksListProps } from './TasksListProps'
import styles from './TasksList.module.scss'
import clsx from 'clsx'
import { TaskCard } from '../task-card'
import { useRef } from 'react'

export function TasksList({ tasks, testId, onTaskReorder }: TasksListProps) {
	const draggedTaskIdRef = useRef<HTMLElement | null>(null)
	const hoverRef = useRef<HTMLElement | null>(null)

	function handleDragging(event: React.DragEvent<HTMLDivElement>) {
		if (draggedTaskIdRef.current === null) {
			const draggedElement = event.target as HTMLElement
			draggedTaskIdRef.current = draggedElement.closest(
				`[task-id]`,
			) as HTMLElement | null
		}

		const hovered = document.elementFromPoint(
			event.clientX,
			event.clientY,
		) as HTMLElement

		if (!hovered) return

		const element = hovered.closest(`[task-id]`) as HTMLElement

		if (element !== hoverRef.current) {
			hoverRef.current?.classList.remove(
				styles.hoveredUpper,
				styles.hoveredLower,
			)
		}

		if (element) {
			if (hoverRef.current !== element) {
				hoverRef.current = element
			}

			if (element !== draggedTaskIdRef.current) {
				const rect = element.getBoundingClientRect()
				const isUpperHalf = event.clientY < rect.top + rect.height / 2

				if (isUpperHalf) {
					if (element.classList.contains(styles.hoveredLower)) {
						element.classList.remove(styles.hoveredLower)
					}
					if (!element.classList.contains(styles.hoveredUpper)) {
						element.classList.add(styles.hoveredUpper)
					}
				} else {
					if (element.classList.contains(styles.hoveredUpper)) {
						element.classList.remove(styles.hoveredUpper)
					}
					if (!element.classList.contains(styles.hoveredLower)) {
						element.classList.add(styles.hoveredLower)
					}
				}
			}
		}
	}

	function handleDragEnd() {
		if (hoverRef.current) {
			if (onTaskReorder && draggedTaskIdRef.current) {
				const sourceTaskId =
					draggedTaskIdRef.current.getAttribute('task-id')
				const targetTaskId = hoverRef.current.getAttribute('task-id')

				if (
					sourceTaskId &&
					targetTaskId &&
					sourceTaskId !== targetTaskId
				) {
					const isAbove = hoverRef.current.classList.contains(
						styles.hoveredUpper,
					)
					void onTaskReorder(
						sourceTaskId,
						targetTaskId,
						isAbove ? 'above' : 'below',
					)
				}
			}

			hoverRef.current.classList.remove(
				styles.hoveredUpper,
				styles.hoveredLower,
			)
			hoverRef.current = null
			draggedTaskIdRef.current = null
		}
	}

	return (
		<div
			className={clsx(styles.container)}
			data-testid={testId}
			onDrag={handleDragging}
			onDragEnd={handleDragEnd}
		>
			{tasks.map((task) => (
				<div
					key={task.taskId}
					className={clsx(styles.taskWrapper)}
					task-id={task.taskId}
				>
					<TaskCard {...task} />
				</div>
			))}
		</div>
	)
}
