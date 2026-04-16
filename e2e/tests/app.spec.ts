import { test, expect } from '@playwright/test'

/**
 * Walkthrough test: visits home, about, login pages directly,
 * then navigates to /dashboard which should redirect to /login
 * when the user is not authenticated.
 */
test.describe('App Walkthrough', () => {
	test('All public pages are reachable directly via URL', async ({
		page,
	}) => {
		// can visit public pages directly
		await page.goto('/')
		await expect(page.url()).not.toContain('/login')
		await expect(page.url()).not.toContain('/about')

		await page.goto('/about')
		await expect(page.url()).toContain('/about')

		await page.goto('/login')
		await expect(page.url()).toContain('/login')

		// cannot visit protected page directly
		await page.goto('/dashboard')
		await page.waitForURL('/login')
	})
})
