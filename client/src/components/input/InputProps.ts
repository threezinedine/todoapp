export interface InputProps {
	field?: string
	value?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	type?: 'text' | 'password' | 'email' | 'number'
	dataTestId?: string
}
