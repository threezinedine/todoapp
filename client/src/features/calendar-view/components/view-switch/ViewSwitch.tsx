import styles from './ViewSwitch.module.scss'
import type { ViewSwitchProps } from './ViewSwitchPropts'
import { ViewSwitch as SharedViewSwitch } from '~/state-components'

const VIEW_OPTIONS = [
	{ value: 'day', label: 'Day' },
	{ value: 'week', label: 'Week' },
	{ value: 'month', label: 'Month' },
] as const

export function ViewSwitch({
	defaultView = 'day',
	onViewChange,
}: ViewSwitchProps) {
	return (
		<SharedViewSwitch
			defaultValue={defaultView}
			onValueChange={onViewChange}
			options={[...VIEW_OPTIONS]}
			classNames={{
				wrapper: styles.wrapper,
				button: styles.viewButton,
				activeButton: styles.activeButton,
				indicator: styles.indicator,
				indicatorByValue: {
					day: styles['day-active'],
					week: styles['week-active'],
					month: styles['month-active'],
				},
			}}
		/>
	)
}
