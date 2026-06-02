import { describe, expect, it, vi } from 'vitest'
import { SessionList } from './SessionList'

describe('SessionList', () => {
	it('starts with no current session', async () => {
		const sessionList = new SessionList()

		expect(sessionList.currentSession).toBeNull()
		expect(sessionList.hasError()).toBe(true)
		expect(sessionList.toStateJson()).toBe(
			JSON.stringify({ sessions: [], currentSessionIndex: 0 }),
		)
		await sessionList.step() // Should not throw even if list is empty
		expect(sessionList.currentSession).toBeNull()
		expect(sessionList.toStateJson()).toBe(
			JSON.stringify({ sessions: [], currentSessionIndex: 0 }),
		)
	})

	it('adds sessions in FIFO order', () => {
		const sessionList = new SessionList()

		sessionList.addSession('work', 1500)
		sessionList.addSession('break', 300)

		expect(sessionList.currentSession?.type).toBe('work')
		expect(sessionList.currentSession?.seconds).toBe(1500)
	})

	it('pops one latest session by default', async () => {
		const sessionList = new SessionList()

		sessionList.addSession('work', 2)
		sessionList.addSession('break', 5)
		sessionList.popSession()

		await sessionList.step()
		expect(sessionList.currentSession?.type).toBe('work')
		expect(sessionList.currentSession?.seconds).toBe(1)
	})

	it('pops multiple latest sessions when count is provided', async () => {
		const sessionList = new SessionList()

		sessionList.addSession('work', 1)
		sessionList.addSession('break', 1)
		sessionList.addSession('long_break', 10)
		sessionList.popSession(2)

		expect(sessionList.currentSession?.type).toBe('work')

		await sessionList.step()
		expect(sessionList.currentSession).toBeNull()
	})

	it('serializes and restores list state', async () => {
		const source = new SessionList()
		source.addSession('work', 3)
		source.addSession('break', 2)

		await source.step()
		expect(source.currentSession?.seconds).toBe(2)

		const json = source.toStateJson()
		const restored = SessionList.fromStateJson(json)

		expect(restored.currentSession?.type).toBe('work')
		expect(restored.currentSession?.seconds).toBe(2)
	})

	it('returns null current session when restored index is out of bounds', () => {
		const restored = SessionList.fromStateJson(
			JSON.stringify({
				sessions: [{ type: 'work', seconds: 10 }],
				currentSessionIndex: 99,
			}),
		)

		expect(restored.currentSession).toBeNull()
		expect(restored.hasError()).toBe(true)
	})

	it('normalizes negative current index when accessing current session', () => {
		const sessionList = SessionList.fromStateJson(
			JSON.stringify({
				sessions: [{ type: 'work', seconds: 10 }],
				currentSessionIndex: -2,
			}),
		)

		expect(sessionList.currentSession?.type).toBe('work')
		expect(sessionList.currentSession?.seconds).toBe(10)
		expect(sessionList.hasError()).toBe(false)
	})

	it('decrements seconds and advances to next session on completion', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 1)
		sessionList.addSession('break', 5)

		await sessionList.step()

		expect(sessionList.currentSession?.type).toBe('break')
		expect(sessionList.currentSession?.seconds).toBe(5)
	})

	it('updates current session seconds using step callback', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 10)

		await sessionList.step((session) => session.seconds - 3)

		expect(sessionList.currentSession?.type).toBe('work')
		expect(sessionList.currentSession?.seconds).toBe(7)
	})

	it('uses callback result to complete and advance to next session', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 5)
		sessionList.addSession('break', 8)

		await sessionList.step(() => 0)

		expect(sessionList.currentSession?.type).toBe('break')
		expect(sessionList.currentSession?.seconds).toBe(8)
	})

	it('handles stepping an empty list without throwing', async () => {
		const sessionList = new SessionList()

		await expect(sessionList.step()).resolves.toBeUndefined()
		expect(sessionList.currentSession).toBeNull()
	})

	it('appends next session from onSessionCompleted callback', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 1)

		const onSessionCompleted = vi
			.fn()
			.mockResolvedValue({ type: 'break', seconds: 300 })

		sessionList.registerOnSessionCompleted(onSessionCompleted)

		await sessionList.step()

		expect(onSessionCompleted).toHaveBeenCalledTimes(1)
		expect(onSessionCompleted).toHaveBeenCalledWith({
			type: 'work',
			seconds: 0,
		})
		expect(sessionList.currentSession?.type).toBe('break')
		expect(sessionList.currentSession?.seconds).toBe(300)
	})

	it('passes callback-updated session to onSessionCompleted', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 12)

		const onSessionCompleted = vi.fn().mockResolvedValue(null)
		sessionList.registerOnSessionCompleted(onSessionCompleted)

		await sessionList.step(() => -1)

		expect(onSessionCompleted).toHaveBeenCalledTimes(1)
		expect(onSessionCompleted).toHaveBeenCalledWith({
			type: 'work',
			seconds: -1,
		})
		expect(sessionList.currentSession).toBeNull()
	})

	it('does not append a session when onSessionCompleted returns null', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 1)
		sessionList.registerOnSessionCompleted(vi.fn().mockResolvedValue(null))

		await sessionList.step()

		expect(sessionList.currentSession).toBeNull()
	})

	it('clears all sessions when a long_break completes', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('long_break', 1)
		sessionList.addSession('work', 10)

		await sessionList.step()

		expect(sessionList.currentSession).toBeNull()
		expect(sessionList.toStateJson()).toBe(
			JSON.stringify({ sessions: [], currentSessionIndex: 0 }),
		)
	})

	it('waits for async onSessionCompleted before exposing appended session', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 1)
		sessionList.registerOnSessionCompleted(
			vi.fn().mockImplementation(
				() =>
					new Promise((resolve) => {
						setTimeout(
							() =>
								resolve({
									type: 'break',
									seconds: 123,
								}),
							10,
						)
					}),
			),
		)

		await sessionList.step()

		expect(sessionList.currentSession?.type).toBe('break')
		expect(sessionList.currentSession?.seconds).toBe(123)
	})

	it('resets sessions and index via reset()', async () => {
		const sessionList = new SessionList()
		sessionList.addSession('work', 1)
		sessionList.addSession('break', 10)

		await sessionList.step()
		expect(sessionList.currentSession?.type).toBe('break')

		sessionList.reset()

		expect(sessionList.currentSession).toBeNull()
		expect(sessionList.hasError()).toBe(true)
		expect(sessionList.toStateJson()).toBe(
			JSON.stringify({ sessions: [], currentSessionIndex: 0 }),
		)
	})
})
