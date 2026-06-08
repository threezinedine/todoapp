export interface Transition {
	to: string
	condition: () => boolean
	from?: string
}

export class FSMState {
	private states: { [key: string]: FSMState } = {}
	private transitions: { [key: string]: Transition[] } = {}
	private currentState: FSMState | null = null
	private currentStateName: string | null = null

	// callbacks
	onEnter?: () => void
	onExit?: () => void
	onUpdate?: () => void

	constructor(
		onEnter?: () => void,
		onExit?: () => void,
		onUpdate?: () => void,
	) {
		this.states = {}
		this.transitions = {}
		this.onEnter = onEnter
		this.onExit = onExit
		this.onUpdate = onUpdate
		this.currentState = null
		this.currentStateName = null
	}

	addState(name: string, state: FSMState) {
		if (this.states[name]) {
			console.warn(`State ${name} already exists and will be overwritten`)
		}

		this.states[name] = state

		if (!this.currentState) {
			this.currentState = state
			this.currentStateName = name
		}
	}

	addTransition(from: string, to: string, condition: () => boolean) {
		if (!this.states[from]) {
			throw new Error(`State ${from} does not exist`)
		}

		if (!this.states[to]) {
			throw new Error(`State ${to} does not exist`)
		}

		if (!this.transitions[from]) {
			this.transitions[from] = []
		}

		this.transitions[from].push({ to, condition, from })
	}

	enter() {
		if (this.onEnter) {
			this.onEnter()
		}

		if (this.currentState && this.currentState) {
			this.currentState.enter()
		}
	}

	exit() {
		if (this.currentState && this.currentState) {
			this.currentState.exit()
		}

		if (this.onExit) {
			this.onExit()
		}
	}

	update() {
		if (this.onUpdate) {
			this.onUpdate()
		}

		if (this.currentStateName) {
			const transitions = this.transitions[this.currentStateName] || []

			for (const transition of transitions) {
				if (transition.condition()) {
					this.transitionTo(transition.to)
				}
			}
		}

		if (this.currentState && this.currentState) {
			this.currentState.update()
		}
	}

	transitionTo(stateName: string) {
		if (!this.states[stateName]) {
			throw new Error(`State ${stateName} does not exist`)
		}

		if (this.currentState && this.currentState) {
			this.currentState.exit()
		}

		this.currentState = this.states[stateName]
		this.currentStateName = stateName

		if (this.currentState && this.currentState) {
			this.currentState.enter()
		}
	}

	/**
	 * State checking via the route scheme like: "On/Working/Idle"
	 * @param stateName
	 * @returns
	 */
	isStateActive(stateName: string): boolean {
		const parts = stateName.split('/')

		if (parts.length === 0) {
			return false
		}

		if (parts.length === 1) {
			if (this.currentStateName === parts[0]) {
				return true
			} else {
				return false
			}
		}

		if (this.currentState === null || this.currentStateName !== parts[0]) {
			return false
		}

		return this.currentState.isStateActive(parts.slice(1).join('/'))
	}

	debugInfo(index?: number, name?: string) {
		let infoIndex = 0

		if (index !== undefined) {
			infoIndex = index
		}

		let finalInfo = ''

		for (let i = 0; i < infoIndex; i++) {
			finalInfo += '\t'
		}

		if (name) {
			finalInfo += `[${name}]: `
		} else {
			finalInfo += '[Root]: '
		}

		finalInfo += `currentState=${this.currentStateName}`

		for (const stateName in this.states) {
			finalInfo +=
				'\n' +
				this.states[stateName].debugInfo(infoIndex + 1, stateName)
		}

		return finalInfo
	}
}

export function createState(hooks?: {
	onEnter?: () => void
	onExit?: () => void
	onUpdate?: () => void
}) {
	return new FSMState(hooks?.onEnter, hooks?.onExit, hooks?.onUpdate)
}
