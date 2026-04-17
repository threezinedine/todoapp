import type { AvatarProps } from './AvatarProps'
import styles from './Avatar.module.scss'

function getInitials(name: string): string {
	return name
		.split(' ')
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('')
}

export function Avatar({ url, name, size = 40, status }: AvatarProps) {
	const hasImage = Boolean(url)

	return (
		<div className={styles.wrapper} style={{ width: size, height: size }}>
			<div className={`${styles.avatar} ${hasImage ? '' : styles.fallback}`}>
				{hasImage ? (
					<img src={url} alt={name ?? 'Avatar'} />
				) : (
					<span className={styles.initials}>{name ? getInitials(name) : '?'}</span>
				)}
			</div>
			{status && (
				<span className={`${styles.status} ${styles[`status-${status}`]}`} />
			)}
		</div>
	)
}