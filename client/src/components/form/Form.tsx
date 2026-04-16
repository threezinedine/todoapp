import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { FormHandle } from './FormProps'
import type { FormProps } from './FormProps'
import { Input } from '~/components/input'
import styles from './Form.module.scss'
import clsx from 'clsx'

export const Form = forwardRef<FormHandle, FormProps>(function Form(
	{ fields, submitButton, className, onSubmit },
	ref,
) {
	const formRef = useRef<HTMLFormElement>(null)

	function getFormValues() {
		if (formRef.current) {
			// get full input tags from form
			const inputs = formRef.current.querySelectorAll('input')
			const formValues: { [key: string]: any } = {}

			inputs.forEach((input) => {
				formValues[input.name] = input.value
			})

			return formValues
		}
		return {}
	}

	function resetForm() {
		if (formRef.current) {
			// Reset all input fields
			const inputs = formRef.current.querySelectorAll('input')
			inputs.forEach((input) => {
				input.value = ''
			})
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
			className={clsx(styles.form, className)}
		>
			{fields.map(({ field, type }, index) => (
				<Input
					key={index}
					field={field}
					type={type}
				/>
			))}
			{submitButton}
		</form>
	)
})

Form.displayName = 'Form'
