import type { FormHTMLAttributes } from 'react'

type FieldValue = string | number | Date | undefined

export interface FieldProps {
	field: string
	type: 'text' | 'password' | 'email' | 'number' | 'date' | 'textarea'
	defaultValue?: FieldValue
}

export interface FormProps extends Omit<
	FormHTMLAttributes<HTMLDivElement>,
	'onSubmit'
> {
	fields: FieldProps[]
	dataTestId?: string
	submitButton?: React.ReactNode
	onSubmit?: (values: Record<string, FieldValue>) => Promise<void> | void
}

export interface FormHandle {
	submit: () => Promise<void>
	reset: () => Promise<void>
}
