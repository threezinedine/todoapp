export interface FieldProps {
	field: string
	type: 'text' | 'password' | 'email' | 'number'
}

export interface FormProps {
	fields: FieldProps[]
	submitButton?: React.ReactNode
}
