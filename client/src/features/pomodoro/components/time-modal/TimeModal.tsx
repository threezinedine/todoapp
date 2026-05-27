import {
	useCallback,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react'
import type {
	PomodoroMode,
	TimeModalProps,
	TimeModalHandle,
} from './TimeModalProps'
import styles from './TimeModal.module.scss'
import clsx from 'clsx'
import { Button, Modal } from '~/components'
import { ViewSwitch } from '~/state-components'
import { useTimeStore } from '../../stores/time-store'
import { toast } from '~/stores'
import { useTasksStore } from '~/features/tasks'

let MODE_SECONDS: Record<PomodoroMode, number> = {
	work: 25 * 60,
	shortBreak: 5 * 60,
	longBreak: 15 * 60,
}

if (import.meta.env.VITE_API_ENVIRONMENT === 'development') {
	MODE_SECONDS.work = 30
	MODE_SECONDS.shortBreak = 2
	MODE_SECONDS.longBreak = 3
}

const MODE_LABELS: Record<PomodoroMode, string> = {
	work: 'Working Time',
	shortBreak: 'Short Break',
	longBreak: 'Long Break',
}

export const TimeModal = forwardRef<TimeModalHandle, TimeModalProps>(
	({}, ref) => {
		const [isOpen, setIsOpen] = useState(false)
		const [mode, setMode] = useState<PomodoroMode>('work')
		const [isRunning, setIsRunning] = useState(false)
		const [remainingSeconds, setRemainingSeconds] = useState(
			MODE_SECONDS.work,
		)

		const { completeTask, tasks } = useTasksStore()
		const {
			taskRemainSeconds,
			state,
			assignTask,
			reset,
			start,
			stop,
			ping,
			taskId,
			connectWebSocket,
			disconnectWebSocket,
		} = useTimeStore()
		const displayedSeconds =
			mode === 'work'
				? (taskRemainSeconds ?? remainingSeconds)
				: remainingSeconds
		const taskName = useMemo(() => {
			if (!taskId) {
				return 'Pomodoro Task'
			}

			return (
				tasks.find((task) => task.taskId === taskId)?.taskName ??
				'Pomodoro Task'
			)
		}, [taskId, tasks])

		const moveToNextUnfinishedTaskOrClose = useCallback(async () => {
			const incompleteTasks = tasks.filter((task) => !task.isComplete)

			if (incompleteTasks.length === 0) {
				setIsOpen(false)
				setIsRunning(false)
				return
			}

			const currentTaskIndex = tasks.findIndex(
				(task) => task.taskId === taskId,
			)

			const nextTask =
				tasks
					.slice(currentTaskIndex + 1)
					.find((task) => !task.isComplete) ??
				tasks
					.slice(0, Math.max(currentTaskIndex, 0))
					.find((task) => !task.isComplete) ??
				incompleteTasks[0]

			assignTask(nextTask.taskId)
			setMode('work')
			setIsRunning(false)
			setRemainingSeconds(MODE_SECONDS.work)
			await connectWebSocket()
		}, [assignTask, connectWebSocket, taskId, tasks])

		useImperativeHandle(ref, () => ({
			toggle: () => setIsOpen((prev) => !prev),
			toWork: () => onChangeMode('work'),
			toShortBreak: () => onChangeMode('shortBreak'),
			toLongBreak: () => onChangeMode('longBreak'),
		}))

		useEffect(() => {
			if (isOpen) {
				ping()
			} else {
				reset()
			}
		}, [isOpen])

		useEffect(() => {
			if (!isRunning) {
				return
			}

			if (mode === 'work') {
				const interval = window.setInterval(() => {
					void ping()
				}, 1000)

				return () => window.clearInterval(interval)
			}

			const interval = window.setInterval(() => {
				setRemainingSeconds((previousSeconds) =>
					Math.max(0, previousSeconds - 1),
				)
			}, 1000)

			return () => window.clearInterval(interval)
		}, [isRunning, mode, ping])

		useEffect(() => {
			if (
				mode === 'work' ||
				isRunning === false ||
				remainingSeconds > 0
			) {
				return
			}

			setIsRunning(false)
			void moveToNextUnfinishedTaskOrClose()
		}, [isRunning, mode, remainingSeconds, moveToNextUnfinishedTaskOrClose])

		useEffect(() => {
			if (state === 'break') {
				setIsRunning(false)
				setMode('shortBreak')
				setRemainingSeconds(MODE_SECONDS.shortBreak)
			} else if (state === 'longBreak') {
				setIsRunning(false)
				setMode('longBreak')
				setRemainingSeconds(MODE_SECONDS.longBreak)
			}

			if (state !== 'work' && taskId) {
				toast.success(
					'Time for a break! Take a rest before the next session.',
					{
						title: 'Break Time',
					},
				)
				if (taskId) {
					completeTask?.(taskId)
				}
			}
		}, [state])

		const timeLabel = useMemo(() => {
			const minutes = Math.floor(displayedSeconds / 60)
			const seconds = displayedSeconds % 60

			return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		}, [displayedSeconds])

		function onChangeMode(selectedMode: PomodoroMode) {
			setMode(selectedMode)
			setIsRunning(false)
			setRemainingSeconds(MODE_SECONDS[selectedMode])

			if (selectedMode === 'work') {
				connectWebSocket()
			} else {
				disconnectWebSocket()
			}
		}

		function onClose() {
			setIsOpen(false)
			setIsRunning(false)
			setMode('work')
			setRemainingSeconds(MODE_SECONDS.work)
		}

		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				dataTestId="time-modal"
			>
				<div className={clsx(styles.container)}>
					<ViewSwitch
						className={clsx(styles.modeSwitch)}
						value={mode}
						onValueChange={onChangeMode}
						options={(
							Object.keys(MODE_LABELS) as PomodoroMode[]
						).map((buttonMode) => ({
							value: buttonMode,
							label: MODE_LABELS[buttonMode],
						}))}
						testId="time-modal-view-switch"
					/>

					<div
						className={clsx(styles.clock)}
						data-testid="time-modal-label"
					>
						{timeLabel}
					</div>

					<p className={clsx(styles.taskName)}>{taskName}</p>

					<div className={clsx(styles.controls)}>
						<Button
							text={isRunning ? 'Stop' : 'Start'}
							onClick={async () => {
								if (isRunning) {
									if (mode === 'work') {
										await stop()
									}
									setIsRunning(false)
								} else {
									if (mode === 'work') {
										await start()
									}
									setIsRunning(true)
								}
							}}
							variant="glick"
							className={clsx(styles.startStopButton)}
							dataTestId="time-modal-start-stop-button"
						/>
					</div>
				</div>
			</Modal>
		)
	},
)

TimeModal.displayName = 'TimeModal'
