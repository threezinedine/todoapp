import type { FormHTMLAttributes } from 'react'

export interface FieldProps {
	field: string
	type: 'text' | 'password' | 'email' | 'number'
}

export interface FormProps extends Omit<
	FormHTMLAttributes<HTMLDivElement>,
	'onSubmit'
> {
	fields: FieldProps[]
	dataTestId?: string
	submitButton?: React.ReactNode
	onSubmit?: (values: Record<string, string>) => Promise<void>
}

export interface FormHandle {
	submit: () => Promise<void>
	reset: () => Promise<void>
}
