import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
	children,
	variant = 'primary',
	className = '',
	...rest
}: ButtonProps) {
	return (
		<button
			className={`${styles.button} ${styles[variant]} ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
}
