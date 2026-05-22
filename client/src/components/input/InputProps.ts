export interface InputProps {
	field?: string
	value?: string | number | boolean
	defaultValue?: string | number | boolean
	onChange?: (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void
	type?:
		| 'text'
		| 'password'
		| 'email'
		| 'number'
		| 'date'
		| 'textarea'
		| 'boolean'
	dataTestId?: string
	isLoading?: boolean
	enterTrigger?: () => void
}
