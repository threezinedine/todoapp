import {
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
		const [taskName] = useState('Pomodoro Task')
		const [remainingSeconds, setRemainingSeconds] = useState(
			MODE_SECONDS.work,
		)

		const {
			taskRemainSeconds,
			state,
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
				: MODE_SECONDS[mode]

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

			const interval = window.setInterval(() => {
				void ping()
			}, 1000)

			return () => window.clearInterval(interval)
		}, [isRunning, ping])

		useEffect(() => {
			if (state === 'break') {
				setIsRunning(false)
				setMode('shortBreak')
			} else if (state === 'longBreak') {
				setIsRunning(true)
				setMode('longBreak')
			}

			if (state !== 'work' && taskId) {
				toast.success(
					'Time for a break! Take a rest before the next session.',
					{
						title: 'Break Time',
					},
				)
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
									await stop()
									setIsRunning(false)
								} else {
									await start()
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
