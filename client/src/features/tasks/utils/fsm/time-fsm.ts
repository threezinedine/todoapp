import { FSMState } from '~/utils'
import { createState } from '~/utils/fsm'

interface TimeFSMCallbacks {
	// Condition callbacks
	getNextTask: () => string | null
	isTaskFinished: () => boolean
	isBreakFinished: () => boolean

	// Attached callbacks
	onOpenModal?: () => void
	onCloseModal?: () => void
}

export class TimeFSM {
	private root: FSMState

	// external callbacks
	private callbacks: TimeFSMCallbacks

	// Define the flags for the conditions
	private openModalRequest: boolean = false
	private closeModalRequest: boolean = false
	private toWorkRequest: boolean = false
	private toBreakRequest: boolean = false
	private toLongBreakRequest: boolean = false
	private runRequest: boolean = false
	private stopRequest: boolean = false

	constructor(callbacks: TimeFSMCallbacks) {
		this.root = createState()
		this.callbacks = callbacks

		this.root.addState(
			'Off',
			createState({
				onEnter: () => {
					this.closeModalRequest = false
				},
			}),
		)

		const onState = createState({
			onEnter: () => {
				this.openModalRequest = false
				this.callbacks.onOpenModal?.()
			},
			onExit: () => {
				this.callbacks.onCloseModal?.()
			},
		})
		this.root.addState('On', onState)

		this.root.addTransition('Off', 'On', () => this.openModalRequest)
		this.root.addTransition('On', 'Off', () => {
			return (
				!this.closeModalRequest || this.callbacks.getNextTask() === null
			)
		})

		this.setupOnState(onState)

		this.root.enter() // Start the FSM
	}

	setupOnState(onState: FSMState) {
		const workingState = createState()
		const breakState = createState()
		const longBreakState = createState()

		onState.addState('Working', workingState)
		onState.addState('Break', breakState)
		onState.addState('LongBreak', longBreakState)

		this.setupRunState(workingState)
		this.setupRunState(breakState)
		this.setupRunState(longBreakState)

		onState.addTransition(
			'Break',
			'LongBreak',
			() => this.toLongBreakRequest,
		)

		onState.addTransition('LongBreak', 'Break', () => this.toBreakRequest)

		onState.addTransition('Working', 'Break', () => {
			return this.toBreakRequest || this.callbacks.isTaskFinished()
		})

		onState.addTransition('Break', 'Working', () => {
			return this.toWorkRequest || this.callbacks.isBreakFinished()
		})

		onState.addTransition('LongBreak', 'Working', () => {
			return this.toWorkRequest || this.callbacks.isBreakFinished()
		})

		onState.addTransition('Working', 'LongBreak', () => {
			return this.toLongBreakRequest || this.callbacks.isTaskFinished()
		})
	}

	setupRunState(workingState: FSMState) {
		workingState.addState('Idle', createState())

		workingState.addState('Running', createState())

		workingState.addTransition('Idle', 'Running', () => this.runRequest)
		workingState.addTransition('Running', 'Idle', () => this.stopRequest)
	}

	requestOpenModal() {
		this.openModalRequest = true
		this.root.update()
		this.openModalRequest = false
	}

	requestCloseModal() {
		this.closeModalRequest = true
		this.root.update()
		this.closeModalRequest = false
	}

	requestRun() {
		this.runRequest = true
		this.root.update()
		this.runRequest = false
	}

	requestStop() {
		this.stopRequest = true
		this.root.update()
		this.stopRequest = false
	}

	requestToWork() {
		this.toWorkRequest = true
		this.root.update()
		this.toWorkRequest = false
	}

	requestToBreak() {
		this.toBreakRequest = true
		this.root.update()
		this.toBreakRequest = false
	}

	requestToLongBreak() {
		this.toLongBreakRequest = true
		this.root.update()
		this.toLongBreakRequest = false
	}
}
