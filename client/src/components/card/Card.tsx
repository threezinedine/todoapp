import type { CardProps } from './CardProps'
import { SecureDataIcon } from '~/icons'
import styles from './Card.module.scss'

export function Card({ title, content, dataTestId }: CardProps) {
	return (
		<div
			className={styles.card}
			data-testid={dataTestId}
		>
			<div
				className={styles['card-header']}
				data-testid={dataTestId ? `${dataTestId}-header` : undefined}
			>
				<div className={styles['card-title']}>
					<SecureDataIcon />
					<span>{title}</span>
				</div>
				<div className={styles['card-dots']}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<div
				className={styles['card-body']}
				data-testid={dataTestId ? `${dataTestId}-body` : undefined}
			>
				{content}
			</div>
		</div>
	)
}
