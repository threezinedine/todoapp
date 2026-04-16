import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthenRoute } from './shared'
import { RootLayout } from './layout'
import { Home, Dashboard, About, Login } from './pages'

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
		path: '/about',
		element: (
			<RootLayout>
				<About />
			</RootLayout>
		),
	},
	{
		path: '/dashboard',
		element: (
			<AuthenRoute fallback="/login">
				<RootLayout>
					<Dashboard />
				</RootLayout>
			</AuthenRoute>
		),
	},
	{
		path: '/login',
		element: (
			<RootLayout>
				<Login />
			</RootLayout>
		),
	},
]

export const router = createBrowserRouter(routes)

export function AppRouter() {
	return <RouterProvider router={router} />
}
