import type { InputProps } from './InputProps'
import styles from './Input.module.scss'

export function Input({
	field = 'Field',
	value = undefined,
	defaultValue = undefined,
	onChange,
	type = 'text',
	dataTestId = undefined,
}: InputProps) {
	const valueProps = value !== undefined ? { value } : { defaultValue }

	if (type === 'textarea') {
		return (
			<div className={`${styles.container} ${styles.textareaContainer}`}>
				<textarea
					className={styles.textarea}
					name={field}
					{...valueProps}
					onChange={onChange}
					placeholder=""
					data-testid={dataTestId}
				/>
				<label
					className={`${styles.label} ${styles.textareaLabel}`}
					data-text={field}
				>
					{field}
				</label>
			</div>
		)
	}

	if (type === 'date') {
		return (
			<div className={`${styles.container} ${styles.dateContainer}`}>
				<input
					className={`${styles.input} ${styles.dateInput}`}
					name={field}
					{...valueProps}
					onChange={onChange}
					type={type}
					placeholder=""
					data-testid={dataTestId}
				/>
				<label
					className={`${styles.label} ${styles.dateLabel}`}
					data-text={field}
				>
					{field}
				</label>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<input
				className={styles.input}
				name={field}
				{...valueProps}
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
