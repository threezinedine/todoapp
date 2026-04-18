export interface AvatarProps {
	url?: string
	name?: string
	size?: number
	offsetX?: number
	offsetY?: number
	status?: 'online' | 'offline' | 'busy' | 'away'
}
