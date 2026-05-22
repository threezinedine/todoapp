import type { InputProps } from './InputProps'
import styles from './Input.module.scss'

export function Input({
	field = 'Field',
	value = undefined,
	defaultValue = undefined,
	onChange,
	type = 'text',
	dataTestId = undefined,
	isLoading,
	enterTrigger,
}: InputProps) {
	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			event.preventDefault()
			enterTrigger?.()
		}
	}
	const textValueProps =
		value !== undefined
			? { value: value as string | number }
			: { defaultValue: defaultValue as string | number | undefined }

	if (type === 'boolean') {
		const booleanProps =
			value !== undefined
				? { checked: Boolean(value) }
				: { defaultChecked: Boolean(defaultValue) }
		const toggleId = `${field.toLowerCase().replace(/\s+/g, '-')}-toggle`

		return (
			<div className={`${styles.container} ${styles.booleanContainer}`}>
				<label
					className={styles.booleanControl}
					htmlFor={toggleId}
				>
					<input
						id={toggleId}
						className={styles.booleanInput}
						name={field}
						{...booleanProps}
						onChange={onChange}
						type="checkbox"
						data-testid={dataTestId}
						disabled={isLoading}
					/>
					<span className={styles.booleanTrack}>
						<span className={styles.booleanThumb} />
					</span>
				</label>
				<label
					className={`${styles.label} ${styles.booleanLabel}`}
					htmlFor={toggleId}
				>
					{field}
				</label>
				{isLoading && (
					<>
						<div className={styles.spinner}></div>
						<div className={styles.overlay}></div>
					</>
				)}
			</div>
		)
	}

	if (type === 'textarea') {
		return (
			<div className={`${styles.container} ${styles.textareaContainer}`}>
				<textarea
					className={styles.textarea}
					name={field}
					{...textValueProps}
					onChange={onChange}
					placeholder=""
					data-testid={dataTestId}
					disabled={isLoading}
				/>
				<label
					className={`${styles.label} ${styles.textareaLabel}`}
					data-text={field}
				>
					{field}
				</label>
				{isLoading && (
					<>
						<div className={styles.spinner}></div>
						<div className={styles.overlay}></div>
					</>
				)}
			</div>
		)
	}

	if (type === 'date') {
		return (
			<div className={`${styles.container} ${styles.dateContainer}`}>
				<input
					className={`${styles.input} ${styles.dateInput}`}
					name={field}
					{...textValueProps}
					onChange={onChange}
					type={type}
					placeholder=""
					data-testid={dataTestId}
					disabled={isLoading}
				/>
				<label
					className={`${styles.label} ${styles.dateLabel}`}
					data-text={field}
				>
					{field}
				</label>
				{isLoading && (
					<>
						<div className={styles.spinner}></div>
						<div className={styles.overlay}></div>
					</>
				)}
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<input
				className={styles.input}
				name={field}
				{...textValueProps}
				onChange={onChange}
				onKeyDown={enterTrigger ? handleKeyDown : undefined}
				type={type}
				placeholder=""
				data-testid={dataTestId}
				disabled={isLoading}
			/>
			<label
				className={styles.label}
				data-text={field}
			>
				{field}
			</label>
			{isLoading && (
				<>
					<div className={styles.spinner}></div>
					<div className={styles.overlay}></div>
				</>
			)}
		</div>
	)
}
