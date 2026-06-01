import { create } from 'zustand'
import { getToken } from '~/utils'

function buildWebSocketUrl(taskId: string, token: string | null) {
	const websocketUrl = new URL(import.meta.env.VITE_API_URL)
	websocketUrl.protocol = websocketUrl.protocol === 'https:' ? 'wss:' : 'ws:'
	websocketUrl.pathname = `${websocketUrl.pathname.replace(/\/$/, '')}/sessions/${taskId}`

	if (token) {
		websocketUrl.searchParams.set('token', token)
	}

	return websocketUrl.toString()
}

interface TimeState {
	state: 'work' | 'break' | 'longBreak'
	taskId: string | null
	taskRemainSeconds: number | null
	websocket: WebSocket | null
	isLoading: boolean
	culmulativeBreaks: number

	onTaskComplete?: () => Promise<void> | void
	setOnTaskComplete?: (callback: () => Promise<void> | void) => void

	assignTask: (taskId: string) => void

	connectWebSocket: () => Promise<void>
	start: () => Promise<void>
	stop: () => Promise<void>
	disconnectWebSocket: () => void
	ping: () => Promise<void>
	reset: () => Promise<void>
	changeState: (newState: TimeState['state']) => void
}

export const useTimeStore = create<TimeState>((set, get) => ({
	state: 'work',
	taskId: null,
	taskRemainSeconds: null,
	websocket: null,
	isLoading: false,
	onTaskComplete: undefined,
	setOnTaskComplete: (callback) => {
		set({ onTaskComplete: callback })
	},
	culmulativeBreaks: 0,
	assignTask: (taskId: string) => {
		set({ taskId })
	},

	connectWebSocket: async () => {
		const taskId = get().taskId

		if (!taskId) {
			console.warn('No task assigned for Pomodoro timer.')
			return
		}

		const token = await getToken()

		set({ isLoading: true })
		// TODO: Handle WebSocket connection errors and reconnections
		const ws = new WebSocket(buildWebSocketUrl(taskId, token))
		ws.onopen = async () => {
			set({ websocket: ws, isLoading: false })
			await ws.send('ping')
		}
		ws.onmessage = (event) => {
			const parsedRemainSeconds = Number.parseInt(event.data, 10)

			if (!Number.isNaN(parsedRemainSeconds)) {
				if (parsedRemainSeconds > 0) {
					set({ taskRemainSeconds: parsedRemainSeconds })
				} else {
					const newCulmulativeBreaks = get().culmulativeBreaks + 1
					const currentState = get().state
					const ws = get().websocket

					if (ws) {
						ws.send('stop')
					}

					if (newCulmulativeBreaks >= 4 && currentState === 'work') {
						set({
							websocket: null,
							isLoading: false,
							culmulativeBreaks: 0,
							state: 'longBreak',
						})
					} else {
						set({
							websocket: null,
							isLoading: false,
							culmulativeBreaks: newCulmulativeBreaks,
							state: 'break',
						})
					}

					if (get().onTaskComplete) {
						get().onTaskComplete!()
					}
				}
			}
		}
		ws.onclose = () => {
			const newCulmulativeBreaks = get().culmulativeBreaks + 1
			const currentState = get().state

			if (newCulmulativeBreaks >= 4 && currentState === 'work') {
				set({
					websocket: null,
					isLoading: false,
					culmulativeBreaks: 0,
					state: 'longBreak',
				})
			} else {
				set({
					websocket: null,
					isLoading: false,
					culmulativeBreaks: newCulmulativeBreaks,
					state: 'break',
				})
			}
		}
	},
	start: async () => {
		const ws = get().websocket
		if (ws && ws.readyState === WebSocket.OPEN) {
			await ws.send('start')
		}
	},
	stop: async () => {
		const ws = get().websocket
		if (ws && ws.readyState === WebSocket.OPEN) {
			await ws.send('stop')
		}
	},
	disconnectWebSocket: () => {
		const ws = get().websocket
		if (ws) {
			ws.close()
			set({ websocket: null, isLoading: false })
		}
	},
	ping: async () => {
		const ws = get().websocket
		if (ws && ws.readyState === WebSocket.OPEN) {
			await ws.send('ping')
		}
	},
	reset: async () => {
		set({
			state: 'work',
			taskRemainSeconds: null,
			websocket: null,
			isLoading: false,
			culmulativeBreaks: 0,
		})
	},
	changeState: (newState) => {
		set({ state: newState })
	},
}))
