import React, { forwardRef, useImperativeHandle } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from './TaskCard'

const { openModalSpy } = vi.hoisted(() => ({
	openModalSpy: vi.fn(),
}))

vi.mock('./TaskCard.module.scss', () => ({
	default: {
		container: 'container',
		selectedTask: 'selectedTask',
		content: 'content',
		nameSelect: 'nameSelect',
		completed: 'completed',
		selected: 'selected',
		icon: 'icon',
		collapsed: 'collapsed',
		checkbox: 'checkbox',
		rect: 'rect',
		mark: 'mark',
		name: 'name',
		option: 'option',
		dragging: 'dragging',
	},
}))

vi.mock('~/icons', () => ({
	DragHandleIcon: () => <svg data-testid="drag-icon" />,
	CheckMarkIcon: () => <svg data-testid="check-icon" />,
	OptionIcon: () => <svg data-testid="option-icon" />,
	SettingsIcon: () => <svg data-testid="settings-icon" />,
	DeleteIcon: () => <svg data-testid="delete-icon" />,
}))

vi.mock('~/state-components', () => {
	const ValidateModal = forwardRef<
		{ open: () => void },
		{ dataTestId?: string }
	>(({ dataTestId }, ref) => {
		useImperativeHandle(ref, () => ({
			open: openModalSpy,
		}))

		return <div data-testid={dataTestId}>validate-modal</div>
	})

	return {
		Dropdown: ({
			children,
			items,
		}: {
			children: React.ReactNode
			items: Array<{
				label?: string
				testId?: string
				onClick?: () => Promise<void> | void
			}>
		}) => (
			<div data-testid="dropdown">
				{children}
				{items.map((item, index) => (
					<button
						key={index}
						type="button"
						data-testid={
							item.testId ?? `mock-dropdown-item-${index}`
						}
						onClick={() => {
							void item.onClick?.()
						}}
					>
						{item.label}
					</button>
				))}
			</div>
		),
		ValidateModal,
	}
})

describe('TaskCard', () => {
	it('in default mode, clicking option and delete opens the modal', async () => {
		const user = userEvent.setup()
		openModalSpy.mockClear()

		render(
			<TaskCard
				testId="task-card"
				taskName="Default task"
				variant="default"
			/>,
		)

		await user.click(screen.getByTestId('task-card-option'))
		await user.click(screen.getByTestId('task-card-delete'))

		expect(openModalSpy).toHaveBeenCalledTimes(1)
	})

	it('clicking card container toggles selection in name-select variant', async () => {
		const user = userEvent.setup()
		const onSelectedChange = vi.fn()
		const onOpenPomodoro = vi.fn()

		render(
			<TaskCard
				testId="task-card"
				taskName="Select mode task"
				variant="name-select"
				isSelected={false}
				onSelectedChange={onSelectedChange}
				onOpenPomodoro={onOpenPomodoro}
			/>,
		)

		await user.click(screen.getByTestId('task-card'))

		expect(onSelectedChange).toHaveBeenCalledTimes(1)
		expect(onSelectedChange).toHaveBeenCalledWith(true)
		expect(onOpenPomodoro).not.toHaveBeenCalled()
	})

	it('clicking task name toggles selection in name-select variant', async () => {
		const user = userEvent.setup()
		const onSelectedChange = vi.fn()
		const onOpenPomodoro = vi.fn()

		render(
			<TaskCard
				testId="task-card"
				taskName="Select mode task"
				variant="name-select"
				isSelected={false}
				onSelectedChange={onSelectedChange}
				onOpenPomodoro={onOpenPomodoro}
			/>,
		)

		await user.click(screen.getByText('Select mode task'))

		expect(onSelectedChange).toHaveBeenCalledTimes(1)
		expect(onSelectedChange).toHaveBeenCalledWith(true)
		expect(onOpenPomodoro).not.toHaveBeenCalled()
	})

	it('clicking task name in default variant does not call onSelectedChange', async () => {
		const user = userEvent.setup()
		const onSelectedChange = vi.fn()

		render(
			<TaskCard
				testId="task-card"
				taskName="Default task"
				variant="default"
				onSelectedChange={onSelectedChange}
			/>,
		)

		await user.click(screen.getByText('Default task'))
		expect(onSelectedChange).not.toHaveBeenCalled()
	})
})
