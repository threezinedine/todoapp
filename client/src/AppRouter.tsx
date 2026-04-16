import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthenRoute } from './shared'
import { RootLayout } from './layout'
import { Home, Dashboard } from './pages'

export interface RouteConfig {
	path: string
	element: ReactNode
}

const routes: RouteConfig[] = [
	{
		path: '/',
		element: (
			<RootLayout>
				<Home />
			</RootLayout>
		),
	},
	{
		path: '/dashboard',
		element: (
			<AuthenRoute>
				<RootLayout>
					<Dashboard />
				</RootLayout>
			</AuthenRoute>
		),
	},
]

export const router = createBrowserRouter(routes)

export function AppRouter() {
	return <RouterProvider router={router} />
}
