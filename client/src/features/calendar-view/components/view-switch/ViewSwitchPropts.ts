export interface ViewSwitchProps {
	defaultView?: 'day' | 'week' | 'month'
	onViewChange: (view: 'day' | 'week' | 'month') => Promise<void> | void
}
