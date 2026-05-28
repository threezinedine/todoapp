import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react'
import type {
	CalendarHandle,
	CalendarComponentProps,
	CalendarEventProps,
} from './CalendarProps'
import styles from './DayCalendar.module.scss'
import clsx from 'clsx'

const MINUTES_PER_DAY = 24 * 60
const EVENT_MIN_DURATION_MINUTES = 15
const HOUR_SLOT_HEIGHT = 64
const DEFAULT_EVENT_DURATION_MINUTES = 60
const PIXELS_PER_MINUTE = HOUR_SLOT_HEIGHT / 60
const NOW_REFRESH_INTERVAL_MS = 5000

interface PositionedEvent extends CalendarEventProps {
	startMinute: number
	endMinute: number
	columnIndex: number
	columnCount: number
}

interface PeriodRange {
	newStartDate: Date
	newEndDate: Date
}

function addDays(date: Date, days: number) {
	const nextDate = new Date(date)
	nextDate.setDate(nextDate.getDate() + days)
	return nextDate
}

export function nextPeriod(startDate: Date, endDate?: Date): PeriodRange {
	const newStartDate = addDays(startDate, 1)
	const newEndDate = addDays(endDate ?? startDate, 1)

	return {
		newStartDate,
		newEndDate,
	}
}

export function previousPeriod(startDate: Date, endDate?: Date): PeriodRange {
	const newStartDate = addDays(startDate, -1)
	const newEndDate = addDays(endDate ?? startDate, -1)

	return {
		newStartDate,
		newEndDate,
	}
}

function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	)
}

function clampMinute(value: number) {
	return Math.min(Math.max(value, 0), MINUTES_PER_DAY)
}

function toMinutes(date: Date) {
	return date.getHours() * 60 + date.getMinutes()
}

function formatHourLabel(hour: number) {
	const dt = new Date()
	dt.setHours(hour, 0, 0, 0)

	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		hour12: true,
	}).format(dt)
}

function formatTimeRange(startMinute: number, endMinute: number): string {
	const startHour = Math.floor(startMinute / 60)
	const startMin = startMinute % 60
	const endHour = Math.floor(endMinute / 60)
	const endMin = endMinute % 60

	const startDate = new Date(0, 0, 0, startHour, startMin)
	const endDate = new Date(0, 0, 0, endHour, endMin)

	const startTime = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(startDate)

	const endTime = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(endDate)

	return `${startTime} - ${endTime}`
}

function normalizeEvent(
	event: CalendarEventProps,
	day: Date,
): { startMinute: number; endMinute: number } | null {
	if (event.startedAt && event.endedAt) {
		if (
			!isSameDay(event.startedAt, day) &&
			!isSameDay(event.endedAt, day)
		) {
			return null
		}

		const rawStart = isSameDay(event.startedAt, day)
			? toMinutes(event.startedAt)
			: 0
		const rawEnd = isSameDay(event.endedAt, day)
			? toMinutes(event.endedAt)
			: MINUTES_PER_DAY
		const startMinute = clampMinute(rawStart)
		const endMinute = clampMinute(
			Math.max(rawEnd, startMinute + EVENT_MIN_DURATION_MINUTES),
		)

		return { startMinute, endMinute }
	}

	if (event.startedAt) {
		if (!isSameDay(event.startedAt, day)) {
			return null
		}

		const startMinute = clampMinute(toMinutes(event.startedAt))
		const endMinute = clampMinute(
			startMinute + DEFAULT_EVENT_DURATION_MINUTES,
		)

		return {
			startMinute,
			endMinute: Math.max(
				endMinute,
				startMinute + EVENT_MIN_DURATION_MINUTES,
			),
		}
	}

	if (event.dueDate && isSameDay(event.dueDate, day)) {
		const dueMinutes = toMinutes(event.dueDate)
		const startMinute = dueMinutes === 0 ? 9 * 60 : dueMinutes
		const endMinute = clampMinute(
			startMinute + DEFAULT_EVENT_DURATION_MINUTES,
		)

		return {
			startMinute,
			endMinute: Math.max(
				endMinute,
				startMinute + EVENT_MIN_DURATION_MINUTES,
			),
		}
	}

	return null
}

function getPositionedEvents(
	events: CalendarEventProps[] | undefined,
	day: Date,
): PositionedEvent[] {
	if (!events?.length) {
		return []
	}

	const normalized = events
		.map((event) => {
			const range = normalizeEvent(event, day)
			if (!range) {
				return null
			}

			return {
				event,
				startMinute: range.startMinute,
				endMinute: range.endMinute,
			}
		})
		.filter((entry): entry is NonNullable<typeof entry> => entry !== null)
		.sort(
			(a, b) =>
				a.startMinute - b.startMinute || a.endMinute - b.endMinute,
		)

	if (!normalized.length) {
		return []
	}

	let clusterId = 0
	const clusterMaxColumns = new Map<number, number>()
	const active: Array<{
		endMinute: number
		column: number
		cluster: number
	}> = []
	const assigned: Array<{
		event: CalendarEventProps
		startMinute: number
		endMinute: number
		column: number
		cluster: number
	}> = []

	for (const current of normalized) {
		for (let i = active.length - 1; i >= 0; i -= 1) {
			if (active[i].endMinute <= current.startMinute) {
				active.splice(i, 1)
			}
		}

		if (active.length === 0) {
			clusterId += 1
		}

		const currentCluster = active[0]?.cluster ?? clusterId
		const used = new Set(
			active
				.filter((item) => item.cluster === currentCluster)
				.map((item) => item.column),
		)
		let column = 0
		while (used.has(column)) {
			column += 1
		}

		active.push({
			endMinute: current.endMinute,
			column,
			cluster: currentCluster,
		})

		const concurrentCount = active.filter(
			(item) => item.cluster === currentCluster,
		).length
		clusterMaxColumns.set(
			currentCluster,
			Math.max(
				clusterMaxColumns.get(currentCluster) ?? 0,
				concurrentCount,
			),
		)

		assigned.push({
			event: current.event,
			startMinute: current.startMinute,
			endMinute: current.endMinute,
			column,
			cluster: currentCluster,
		})
	}

	return assigned.map((entry) => ({
		...entry.event,
		startMinute: entry.startMinute,
		endMinute: entry.endMinute,
		columnIndex: entry.column,
		columnCount: clusterMaxColumns.get(entry.cluster) ?? 1,
	}))
}

export const DayCalendar = forwardRef<CalendarHandle, CalendarComponentProps>(
	function DayCalendar(
		{
			startDate = new Date(),
			endDate,
			events = [],
			onPreviousPeriod,
			onNextPeriod,
		},
		ref,
	) {
		const [now, setNow] = useState(() => new Date())
		const viewportRef = useRef<HTMLDivElement>(null)
		const currentTimeMarkerRef = useRef<HTMLDivElement>(null)

		const scrollToCurrentTime = useCallback(() => {
			const viewport = viewportRef.current
			const marker = currentTimeMarkerRef.current

			if (!viewport || !marker) {
				return
			}

			const centeredTop = Math.max(
				0,
				marker.offsetTop - viewport.clientHeight / 2,
			)

			if (typeof viewport.scrollTo === 'function') {
				viewport.scrollTo({
					top: centeredTop,
					behavior: 'smooth',
				})
				return
			}

			viewport.scrollTop = centeredTop
		}, [])

		useImperativeHandle(
			ref,
			() => ({
				focus: () => {
					viewportRef.current?.focus()
					scrollToCurrentTime()
				},
				nextPeriod: () => {
					if (!onNextPeriod) {
						return
					}

					const { newStartDate, newEndDate } = nextPeriod(
						startDate,
						endDate,
					)

					return onNextPeriod(newStartDate, newEndDate)
				},
				previousPeriod: () => {
					if (!onPreviousPeriod) {
						return
					}

					const { newStartDate, newEndDate } = previousPeriod(
						startDate,
						endDate,
					)

					return onPreviousPeriod(newStartDate, newEndDate)
				},
			}),
			[
				endDate,
				onNextPeriod,
				onPreviousPeriod,
				scrollToCurrentTime,
				startDate,
			],
		)

		useEffect(() => {
			const intervalId = window.setInterval(() => {
				setNow(new Date())
			}, NOW_REFRESH_INTERVAL_MS)

			scrollToCurrentTime()

			return () => {
				window.clearInterval(intervalId)
			}
		}, [scrollToCurrentTime])

		const hours = useMemo(
			() => Array.from({ length: 24 }, (_, hour) => hour),
			[],
		)
		const positionedEvents = useMemo(
			() => getPositionedEvents(events, startDate),
			[events, startDate],
		)

		const isToday = isSameDay(startDate, now)
		const nowMinute = isToday ? toMinutes(now) : null
		const timelineHeight = MINUTES_PER_DAY * PIXELS_PER_MINUTE

		return (
			<div className={clsx(styles.container)}>
				<div className={clsx(styles.header)}>
					<h2 className={clsx(styles.title)}>Day</h2>
					<p className={clsx(styles.dateLabel)}>
						{new Intl.DateTimeFormat('en-US', {
							weekday: 'long',
							month: 'long',
							day: 'numeric',
							year: 'numeric',
						}).format(startDate)}
					</p>
				</div>

				<div
					ref={viewportRef}
					className={clsx(styles.scrollViewport)}
					tabIndex={-1}
					data-calendar-day-viewport
				>
					<div
						className={clsx(styles.dayView)}
						style={{ height: `${timelineHeight}px` }}
					>
						<div className={clsx(styles.timeRail)}>
							{hours.map((hour) => (
								<div
									key={hour}
									className={clsx(styles.timeLabel)}
									style={{
										top: `${hour * HOUR_SLOT_HEIGHT}px`,
									}}
								>
									{formatHourLabel(hour)}
								</div>
							))}
						</div>

						<div className={clsx(styles.gridArea)}>
							{hours.map((hour) => (
								<div
									key={hour}
									className={clsx(styles.hourLine)}
									style={{
										top: `${hour * HOUR_SLOT_HEIGHT}px`,
									}}
								/>
							))}

							{isToday && nowMinute !== null && (
								<div
									ref={currentTimeMarkerRef}
									className={clsx(styles.currentTimeLine)}
									data-calendar-current-time-marker
									style={{
										top: `${nowMinute * PIXELS_PER_MINUTE}px`,
									}}
								>
									<span
										className={clsx(styles.currentTimeDot)}
									/>
								</div>
							)}

							<div className={clsx(styles.eventLayer)}>
								{positionedEvents.length === 0 && (
									<div className={clsx(styles.emptyState)}>
										No events scheduled.
									</div>
								)}

								{positionedEvents.map((event, index) => {
									const durationMinutes = Math.max(
										event.endMinute - event.startMinute,
										EVENT_MIN_DURATION_MINUTES,
									)
									const height =
										durationMinutes * PIXELS_PER_MINUTE
									const gapPercent = 1.4
									const widthPercent =
										(100 -
											(event.columnCount - 1) *
												gapPercent) /
										event.columnCount
									const leftPercent =
										event.columnIndex *
										(widthPercent + gapPercent)

									return (
										<article
											key={event.id}
											className={clsx(styles.eventCard)}
											style={{
												top: `${event.startMinute * PIXELS_PER_MINUTE}px`,
												height: `${height}px`,
												width: `${widthPercent}%`,
												left: `${leftPercent}%`,
												// @ts-ignore
												'--color-first': event.color,
												// @ts-ignore
												'--color-second':
													event.gradientColor,
											}}
											onClick={() => {
												if (event.onEventClicked) {
													event.onEventClicked(
														event,
														index,
													)
												}
											}}
										>
											<h3
												className={clsx(
													styles.eventTitle,
												)}
											>
												{event.name}
											</h3>
											<p
												className={clsx(
													styles.eventTime,
												)}
											>
												{formatTimeRange(
													event.startMinute,
													event.endMinute,
												)}
											</p>
											{event.description && (
												<p
													className={clsx(
														styles.eventDescription,
													)}
												>
													{event.description}
												</p>
											)}
										</article>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	},
)

DayCalendar.displayName = 'DayCalendar'
