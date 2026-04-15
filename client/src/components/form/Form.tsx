import type { FormProps } from './FormProps'
import { Input } from '~/components/input'
import styles from './Form.module.scss'
import clsx from 'clsx'

export function Form({ fields, submitButton = null }: FormProps) {
	return (
		<form className={clsx(styles.form)}>
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
}
