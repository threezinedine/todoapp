export interface InputProps {
	field?: string
	value?: string | number
	defaultValue?: string | number
	onChange?: (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void
	type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'textarea'
	dataTestId?: string
	isLoading?: boolean
}
