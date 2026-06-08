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

export class TaskWebsocket {
	private _websocket: WebSocket | null = null
	private _taskId: string | null = null
	private _remainSeconds: number | null = null
	private _onMessageCallback?: () => void | Promise<void>

	constructor(options?: { onMessage?: () => void | Promise<void> }) {
		if (options?.onMessage) {
			this._onMessageCallback = options.onMessage
		}
	}

	async connect(taskId: string) {
		if (this._websocket) {
			console.warn('WebSocket is already connected.')
			this._websocket.close()
			this._reset()
		}

		const token = await getToken()
		this._websocket = new WebSocket(buildWebSocketUrl(taskId, token))
		this._taskId = taskId

		this._websocket.onmessage = async (event) => {
			const parsedRemainSeconds = Number.parseInt(event.data, 10)

			if (!Number.isNaN(parsedRemainSeconds)) {
				this._remainSeconds = parsedRemainSeconds
				await this._onMessageCallback?.()
			}
		}
	}

	async disconnect() {
		if (this._websocket) {
			this._websocket.close()
			this._reset()
		}
	}

	private _reset() {
		this._websocket = null
		this._taskId = null
		this._remainSeconds = null
	}

	isConnected() {
		return (
			this._websocket !== null &&
			this._websocket.readyState === WebSocket.OPEN
		)
	}

	get taskId(): string {
		if (this._taskId === null) {
			throw new Error('No task is currently assigned to the WebSocket.')
		}

		return this._taskId
	}

	get remainSeconds(): number {
		if (this._remainSeconds === null) {
			throw new Error('Remaining seconds is not available.')
		}

		return this._remainSeconds
	}

	async start() {
		if (!this.isConnected()) {
			throw new Error('WebSocket is not connected.')
		}

		await this._websocket?.send('start')
	}

	async stop() {
		if (!this.isConnected()) {
			throw new Error('WebSocket is not connected.')
		}

		await this._websocket?.send('stop')
	}

	getRemainSecondsString() {
		const displayedSeconds = this.remainSeconds
		const minutes = Math.floor(displayedSeconds / 60)
		const seconds = displayedSeconds % 60

		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	}
}
