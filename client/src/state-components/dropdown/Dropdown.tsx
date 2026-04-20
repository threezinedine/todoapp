import { useEffect, useRef, useState } from 'react'
import type { DropdownProps } from './DropdownProps'
import { DropMenu } from '~/components/drop-menu'
import styles from './Dropdown.module.scss'
import clsx from 'clsx'

export function Dropdown({ children, items }: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('click', handleClickOutside)
		}

		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [isOpen])

	return (
		<div ref={containerRef} className={styles.container}>
			<div
				className={clsx(styles.trigger)}
				onClick={() => {
					setIsOpen(!isOpen)
				}}
			>
				{children}
			</div>
			{isOpen && (
				<DropMenu
					items={items}
					isOpen={isOpen}
				/>
			)}
		</div>
	)
}
