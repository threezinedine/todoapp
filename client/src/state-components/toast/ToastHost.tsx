import { useEffect, useRef } from 'react'
import { Toast } from './Toast'
import type { ToastHandle, ToastProps } from './ToastProps'
import { useToastStore } from '~/stores'

export function ToastHost(props: ToastProps) {
	const toastRef = useRef<ToastHandle>(null)

	useEffect(() => {
		useToastStore.getState().setHandler(toastRef.current)

		return () => {
			useToastStore.getState().setHandler(null)
		}
	}, [])

	return (
		<Toast
			ref={toastRef}
			{...props}
		/>
	)
}
