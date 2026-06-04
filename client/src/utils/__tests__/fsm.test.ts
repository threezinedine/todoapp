import { describe, expect, it, vi } from 'vitest'
import { FSMState } from '../fsm'

function createState(hooks?: {
	onEnter?: () => void
	onExit?: () => void
	onUpdate?: () => void
}) {
	return new FSMState(hooks?.onEnter, hooks?.onExit, hooks?.onUpdate)
}

describe('FSMState', () => {
	it('runs root callbacks safely when no child states are registered', () => {
		const rootEnter = vi.fn()
		const rootUpdate = vi.fn()
		const rootExit = vi.fn()

		const fsm = createState({
			onEnter: rootEnter,
			onUpdate: rootUpdate,
			onExit: rootExit,
		})

		expect(() => {
			fsm.enter()
			fsm.update()
			fsm.exit()
		}).not.toThrow()

		expect(rootEnter).toHaveBeenCalledTimes(1)
		expect(rootUpdate).toHaveBeenCalledTimes(1)
		expect(rootExit).toHaveBeenCalledTimes(1)
	})

	it('enters root and initial child state', () => {
		const rootEnter = vi.fn()
		const idleEnter = vi.fn()

		const fsm = createState({ onEnter: rootEnter })
		fsm.addState('idle', createState({ onEnter: idleEnter }))

		fsm.enter()

		expect(rootEnter).toHaveBeenCalledTimes(1)
		expect(idleEnter).toHaveBeenCalledTimes(1)
	})

	it('uses the first added state as initial current state', () => {
		const firstEnter = vi.fn()
		const secondEnter = vi.fn()

		const fsm = createState()
		fsm.addState('first', createState({ onEnter: firstEnter }))
		fsm.addState('second', createState({ onEnter: secondEnter }))

		fsm.enter()

		expect(firstEnter).toHaveBeenCalledTimes(1)
		expect(secondEnter).not.toHaveBeenCalled()
	})

	it('throws when adding transition with unknown from state', () => {
		const fsm = createState()
		fsm.addState('idle', createState())

		expect(() => {
			fsm.addTransition('missing', 'idle', () => true)
		}).toThrow('State missing does not exist')
	})

	it('throws when adding transition with unknown to state', () => {
		const fsm = createState()
		fsm.addState('idle', createState())

		expect(() => {
			fsm.addTransition('idle', 'missing', () => true)
		}).toThrow('State missing does not exist')
	})

	it('throws when transitioning to unknown state', () => {
		const fsm = createState()
		fsm.addState('idle', createState())

		expect(() => {
			fsm.transitionTo('unknown')
		}).toThrow('State unknown does not exist')
	})

	it('calls current child exit before root exit', () => {
		const order: string[] = []

		const fsm = createState({
			onExit: () => order.push('root-exit'),
		})
		fsm.addState(
			'idle',
			createState({
				onExit: () => order.push('idle-exit'),
			}),
		)

		fsm.exit()

		expect(order).toEqual(['idle-exit', 'root-exit'])
	})

	it('transitions by exiting old state then entering target state', () => {
		const order: string[] = []

		const fsm = createState()
		fsm.addState(
			'idle',
			createState({
				onExit: () => order.push('idle-exit'),
			}),
		)
		fsm.addState(
			'running',
			createState({
				onEnter: () => order.push('running-enter'),
			}),
		)

		fsm.transitionTo('running')

		expect(order).toEqual(['idle-exit', 'running-enter'])
	})

	it('self-transition exits and re-enters the same state', () => {
		const order: string[] = []

		const fsm = createState()
		fsm.addState(
			'idle',
			createState({
				onExit: () => order.push('idle-exit'),
				onEnter: () => order.push('idle-enter'),
			}),
		)

		fsm.addTransition('idle', 'idle', () => true)
		fsm.update()

		expect(order).toEqual(['idle-exit', 'idle-enter'])
	})

	it('update runs root update then active child update when no transition passes', () => {
		const order: string[] = []

		const fsm = createState({
			onUpdate: () => order.push('root-update'),
		})
		fsm.addState(
			'idle',
			createState({
				onUpdate: () => order.push('idle-update'),
			}),
		)
		fsm.addState(
			'running',
			createState({
				onEnter: () => order.push('running-enter'),
			}),
		)

		fsm.addTransition('idle', 'running', () => false)
		fsm.update()

		expect(order).toEqual(['root-update', 'idle-update'])
	})

	it('update transitions when condition passes and updates new active state', () => {
		const order: string[] = []

		const fsm = createState({
			onUpdate: () => order.push('root-update'),
		})
		fsm.addState(
			'idle',
			createState({
				onExit: () => order.push('idle-exit'),
			}),
		)
		fsm.addState(
			'running',
			createState({
				onEnter: () => order.push('running-enter'),
				onUpdate: () => order.push('running-update'),
			}),
		)

		fsm.addTransition('idle', 'running', () => true)
		fsm.update()

		expect(order).toEqual([
			'root-update',
			'idle-exit',
			'running-enter',
			'running-update',
		])
	})

	it('evaluates all matching transitions registered for the same source state', () => {
		const order: string[] = []

		const fsm = createState()
		fsm.addState(
			'idle',
			createState({
				onExit: () => order.push('idle-exit'),
			}),
		)
		fsm.addState(
			'running',
			createState({
				onEnter: () => order.push('running-enter'),
				onExit: () => order.push('running-exit'),
			}),
		)
		fsm.addState(
			'paused',
			createState({
				onEnter: () => order.push('paused-enter'),
			}),
		)

		fsm.addTransition('idle', 'running', () => true)
		fsm.addTransition('idle', 'paused', () => true)

		fsm.update()

		expect(order).toEqual([
			'idle-exit',
			'running-enter',
			'running-exit',
			'paused-enter',
		])
	})

	it('bubbles errors thrown by transition condition', () => {
		const fsm = createState()
		fsm.addState('idle', createState())
		fsm.addState('running', createState())
		fsm.addTransition('idle', 'running', () => {
			throw new Error('condition-failed')
		})

		expect(() => fsm.update()).toThrow('condition-failed')
	})

	it('calls current child exit even if enter was never called', () => {
		const childExit = vi.fn()

		const fsm = createState()
		fsm.addState('idle', createState({ onExit: childExit }))

		fsm.exit()

		expect(childExit).toHaveBeenCalledTimes(1)
	})

	it('uses latest state when duplicate state name is added', () => {
		const firstEnter = vi.fn()
		const secondEnter = vi.fn()

		const fsm = createState()
		fsm.addState('idle', createState({ onEnter: firstEnter }))
		fsm.addState('idle', createState({ onEnter: secondEnter }))

		fsm.transitionTo('idle')

		expect(firstEnter).not.toHaveBeenCalled()
		expect(secondEnter).toHaveBeenCalledTimes(1)
	})

	it('evaluates later transition conditions after earlier side effects', () => {
		let canMoveToPaused = false
		const order: string[] = []

		const fsm = createState()
		fsm.addState(
			'idle',
			createState({
				onExit: () => order.push('idle-exit'),
			}),
		)
		fsm.addState(
			'running',
			createState({
				onEnter: () => order.push('running-enter'),
			}),
		)
		fsm.addState(
			'paused',
			createState({
				onEnter: () => order.push('paused-enter'),
			}),
		)

		fsm.addTransition('idle', 'running', () => {
			canMoveToPaused = true
			return false
		})
		fsm.addTransition('idle', 'paused', () => canMoveToPaused)

		fsm.update()

		expect(order).toEqual(['idle-exit', 'paused-enter'])
	})

	it('cascade child lifecycle into nested FSM root callbacks', () => {
		const nestedRootUpdate = vi.fn()
		const nestedRootEnter = vi.fn()
		const nestedLeafEnter = vi.fn()
		const nestedLeftUpdate = vi.fn()

		const nested = createState({
			onEnter: nestedRootEnter,
			onUpdate: nestedRootUpdate,
		})

		nested.addState(
			'nested-idle',
			createState({
				onEnter: nestedLeafEnter,
				onUpdate: nestedLeftUpdate,
			}),
		)

		const parent = createState()
		parent.addState('child', nested)

		parent.enter()
		parent.update()

		expect(nestedRootEnter).toHaveBeenCalledTimes(1)
		expect(nestedRootUpdate).toHaveBeenCalledTimes(1)
		expect(nestedLeafEnter).toHaveBeenCalledTimes(1)
		expect(nestedLeftUpdate).toHaveBeenCalledTimes(1)
	})
})
