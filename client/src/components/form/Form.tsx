import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { FormHandle } from './FormProps'
import type { FormProps } from './FormProps'
import { Input } from '~/components/input'
import styles from './Form.module.scss'
import clsx from 'clsx'

function normalizeDefaultValue(
	type: 'text' | 'password' | 'email' | 'number' | 'date' | 'textarea',
	defaultValue: string | number | Date | undefined,
) {
	if (defaultValue === undefined) {
		return undefined
	}

	if (type === 'date' && defaultValue instanceof Date) {
		if (Number.isNaN(defaultValue.getTime())) {
			return undefined
		}

		return defaultValue.toISOString().slice(0, 10)
	}

	if (defaultValue instanceof Date) {
		return defaultValue.toISOString()
	}

	return defaultValue
}

export const Form = forwardRef<FormHandle, FormProps>(function Form(
	{ fields, submitButton, className, onSubmit, dataTestId },
	ref,
) {
	const formRef = useRef<HTMLFormElement>(null)

	function getFormValues() {
		if (formRef.current) {
			const fields = formRef.current.querySelectorAll<
				HTMLInputElement | HTMLTextAreaElement
			>('input, textarea')
			const formValues: { [key: string]: any } = {}

			fields.forEach((field) => {
				formValues[field.name] = field.value
			})

			return formValues
		}
		return {}
	}

	function resetForm() {
		if (formRef.current) {
			formRef.current.reset()
		}
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (formRef.current) {
			const formValues = getFormValues()
			onSubmit?.(formValues)
		}
	}

	useImperativeHandle<FormHandle, FormHandle>(ref, () => ({
		submit: async () => {
			if (formRef.current) {
				const formValues = getFormValues()
				await onSubmit?.(formValues)
			}
		},
		reset: async () => {
			resetForm()
		},
	}))

	return (
		<form
			onSubmit={handleSubmit}
			ref={formRef}
			data-testid={dataTestId}
			className={clsx(styles.form, className)}
		>
			{fields.map(({ field, type, defaultValue }, index) => (
				<Input
					dataTestId={`${dataTestId}-${field}`}
					key={index}
					field={field}
					type={type}
					defaultValue={normalizeDefaultValue(type, defaultValue)}
				/>
			))}
			{submitButton}
		</form>
	)
})

Form.displayName = 'Form'
