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

		// type wrong login token
		await page
			.locator('[data-testid="login-form-token"]')
			.fill('wrong-token')

		// press the submit button
		await page.locator('[data-testid="login-form-submit"]').click()

		// wait for the error content inside the modal to appear (signals React re-rendered)
		await expect(page.getByText('Login Failed')).toBeVisible({
			timeout: 5000,
		})

		// verify the modal container is attached to the DOM
		await expect(
			page.locator('[data-testid="login-error-modal"]'),
		).toBeAttached()

		await expect(page.getByText('Unauthorized')).toBeVisible({
			timeout: 5000,
		})

		// close the modal
		await page
			.locator('[data-testid="login-error-modal-overlay"]')
			.click({ position: { x: 10, y: 10 } })

		// verify the modal is closed
		await expect(page.getByText('Login Failed')).not.toBeVisible({
			timeout: 5000,
		})

		// clear the token input
		await page.locator('[data-testid="login-form-token"]').fill('')

		// press the submit button again without filling the token
		await page.locator('[data-testid="login-form-submit"]').click()

		// wait for the error content inside the modal to appear (signals React re-rendered)
		await expect(page.getByText('Login Failed')).toBeVisible({
			timeout: 5000,
		})

		await expect(page.getByText('Token is required.')).toBeVisible({
			timeout: 5000,
		})

		// close the modal
		await page
			.locator('[data-testid="login-error-modal-overlay"]')
			.click({ position: { x: 10, y: 10 } })

		// verify the modal is closed
		await expect(page.getByText('Login Failed')).not.toBeVisible({
			timeout: 5000,
		})

		// add the correct token to the input
		await page
			.locator('[data-testid="login-form-token"]')
			.fill('dev-token-only')

		// press the submit button
		await page.locator('[data-testid="login-form-submit"]').click()

		// wait for navigation to home page
		await page.waitForURL('/')

		await expect(page.url()).not.toContain('/login')

		// now can visit protected page directly
		await page.goto('/dashboard')
		await expect(page.url()).toContain('/dashboard')

		// after 1 second, not redirected back to login page (signals token is still valid and user is authenticated)
		await page.waitForTimeout(1000)
		await expect(page.url()).not.toContain('/login')
	})
})
