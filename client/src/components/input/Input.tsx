import type { InputProps } from './InputProps'
import styles from './Input.module.scss'

export function Input({
	field = 'Field',
	value = undefined,
	onChange,
	type = 'text',
	dataTestId = undefined,
}: InputProps) {
	return (
		<div className={styles.container}>
			<input
				className={styles.input}
				name={field}
				value={value}
				onChange={onChange}
				type={type}
				placeholder=""
				data-testid={dataTestId}
			/>
			<label
				className={styles.label}
				data-text={field}
			>
				{field}
			</label>
		</div>
	)
}
