export interface TimeModalHandle {
	toggle: () => void
	toWork: () => void
	toShortBreak: () => void
	toLongBreak: () => void
}

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak'

export interface TimeModalProps {}
