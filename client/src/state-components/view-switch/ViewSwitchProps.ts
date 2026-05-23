export interface ViewSwitchOption<T extends string = string> {
	value: T
	label: string
}

export interface ViewSwitchClassNames<T extends string = string> {
	wrapper?: string
	button?: string
	activeButton?: string
	indicator?: string
	indicatorByValue?: Partial<Record<T, string>>
}

export interface ViewSwitchProps<T extends string = string> {
	options: ViewSwitchOption<T>[]
	defaultValue?: T
	value?: T
	onValueChange?: (value: T) => Promise<void> | void
	className?: string
	classNames?: ViewSwitchClassNames<T>
	testId?: string
}
