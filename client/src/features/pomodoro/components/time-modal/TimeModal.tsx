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

const MODE_SECONDS: Record<PomodoroMode, number> = {
	work: 25 * 60,
	shortBreak: 5 * 60,
	longBreak: 15 * 60,
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

		useImperativeHandle(ref, () => ({
			toggle: () => setIsOpen((prev) => !prev),
		}))

		useEffect(() => {
			if (!isOpen || !isRunning) {
				return
			}

			const timer = window.setInterval(() => {
				setRemainingSeconds((current) => {
					if (current <= 1) {
						window.clearInterval(timer)
						setIsRunning(false)
						return 0
					}

					return current - 1
				})
			}, 1000)

			return () => window.clearInterval(timer)
		}, [isOpen, isRunning])

		const timeLabel = useMemo(() => {
			const minutes = Math.floor(remainingSeconds / 60)
			const seconds = remainingSeconds % 60

			return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		}, [remainingSeconds])

		function onChangeMode(selectedMode: PomodoroMode) {
			setMode(selectedMode)
			setIsRunning(false)
			setRemainingSeconds(MODE_SECONDS[selectedMode])
		}

		function onClose() {
			setIsOpen(false)
			setIsRunning(false)
		}

		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
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
					/>

					<div className={clsx(styles.clock)}>{timeLabel}</div>

					<p className={clsx(styles.taskName)}>{taskName}</p>

					<div className={clsx(styles.controls)}>
						<Button
							text={isRunning ? 'Stop' : 'Start'}
							onClick={() => setIsRunning((current) => !current)}
							variant="glick"
							className={clsx(styles.startStopButton)}
						/>
					</div>
				</div>
			</Modal>
		)
	},
)

TimeModal.displayName = 'TimeModal'
