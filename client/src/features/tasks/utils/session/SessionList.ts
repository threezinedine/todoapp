export type SessionType = 'work' | 'break' | 'long_break'

interface Session {
	type: SessionType
	seconds: number
}

/**
 * The SessionList class manages a list of Session instances. It provides methods to add new sessions and
 *      to step through the sessions, which involves decrementing the seconds of the current session and
 *      handling session transitions when a session ends.
 *
 * Note: I need a setup that i can reload the current state of the session list every time with the state
 *      and continue the timer from where it left off, so the session list should be able to be serialized
 *      and deserialized.
 *
 * Usage:
 * ```ts
 *    const sessionList = new SessionList()
 *    sessionList.addSession('work', 1500, 300) // Add a work session of 25 minutes, followed by a break session of 5 minutes
 *    while (!sessionList.currentSession?.isCompleted) {
 *        await sessionList.ping()
 *    }
 *
 *    // for now, the 'break' session will be automatically added and started after the 'work' session is completed,
 *    //    and the session list will be cleared after the 'long_break' session is completed. The logic can be
 *    //    adjusted as needed.
 *    expect(sessionList.currentSession).not.toBeNull()
 *    expect(sessionList.currentSession?.type).toBe('break')
 * ```
 */
export class SessionList {
	private _sessions: Session[]
	private _currentSessionIndex: number = 0
	private _onSessionCompleted?: (
		session: Session,
	) => Session | Promise<Session> | null | Promise<null>

	constructor() {
		this._sessions = []
	}

	get currentSession() {
		if (this._sessions.length === 0) {
			return null
		}

		if (this._currentSessionIndex >= this._sessions.length) {
			return null
		}

		if (this._currentSessionIndex < 0) {
			this._currentSessionIndex = 0 // Ensure index is not negative
		}

		return this._sessions[this._currentSessionIndex]
	}

	toStateJson() {
		return JSON.stringify({
			sessions: this._sessions,
			currentSessionIndex: this._currentSessionIndex,
		})
	}

	static fromStateJson(json: string) {
		const data = JSON.parse(json)
		const sessionList = new SessionList()
		sessionList._sessions = data.sessions
		sessionList._currentSessionIndex = data.currentSessionIndex
		return sessionList
	}

	hasError() {
		return (
			this._currentSessionIndex < 0 ||
			this._currentSessionIndex >= this._sessions.length
		)
	}

	reset() {
		this._sessions = []
		this._currentSessionIndex = 0
	}

	addSession(type: SessionType, seconds: number) {
		const newSession = { type, seconds }
		this._sessions.push(newSession)
	}

	/**
	 *
	 * @param count the number of sessions to pop, if not provided, pop the latest session in the list
	 */
	popSession(count?: number) {
		if (count === undefined) {
			count = 1
		}

		this._sessions.splice(-count, count)
	}

	registerOnSessionCompleted(
		callback: (
			session: Session,
		) => Session | Promise<Session> | null | Promise<null>,
	) {
		this._onSessionCompleted = callback
	}

	/**
	 * Be called each time (each second in production, but can be called manually in tests) to update the
	 *      current session's remaining seconds and handle session transitions.
	 */
	async step(sessionUpdateCallback?: (session: Session) => number) {
		if (this.currentSession) {
			if (sessionUpdateCallback) {
				this.currentSession.seconds = sessionUpdateCallback(
					this.currentSession,
				)
			} else {
				this.currentSession.seconds--
			}

			const sessionCompleted = this.currentSession.seconds <= 0

			let newSession: Session | null = null

			if (sessionCompleted && this._onSessionCompleted) {
				newSession = await this._onSessionCompleted(this.currentSession)
			}

			if (newSession) {
				this._sessions.push(newSession)
			}

			// if the current session -> long break and be completed, clean the session list
			if (this.currentSession.type === 'long_break' && sessionCompleted) {
				this._sessions = []
				this._currentSessionIndex = 0
				return
			} else if (sessionCompleted) {
				this._currentSessionIndex += 1
			}
		}
	}
}
