import type { InputProps } from './InputProps'
import styles from './Input.module.scss'

export function Input({
	field = 'Field',
	value = undefined,
	onChange,
	type = 'text',
}: InputProps) {
	return (
		<div className={styles.container}>
			<input
				className={styles.input}
				value={value}
				onChange={onChange}
				type={type}
				placeholder=""
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
