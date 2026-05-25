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
		await page.waitForTimeout(100)
		await expect(page.url()).not.toContain('/login')

		// logout by clicking on the avatar -> logout -> confirm
		await page.goto('/') // make sure we are on the home page where the avatar is located
		await page.click('[data-testid="avatar"]')
		await page.click('text=Logout')

		await page.click('[data-testid="logout-validate-modal-cancel"]') // first click cancel to make sure the modal works
		await page.waitForTimeout(100)
		await expect(page.url()).not.toContain('/login') // still not logged out

		await page.click('[data-testid="avatar"]') // open the dropdown again
		await page.click('text=Logout') // click logout again to open the modal
		await page.click('[data-testid="logout-validate-modal-confirm"]') // first click cancel to make sure the modal works

		// wait for navigation to login page
		await page.waitForURL('/login')

		// redirected back to home -> wait 1 second -> redirected back to login (signals user is logged out and token is cleared)
		await page.waitForTimeout(100)
		await page.goto('/dashboard') // try to visit protected page again to confirm we are logged out
		await page.waitForTimeout(100)
		await expect(page.url()).toContain('/login')

		// login and return the home page for the next test
		await page.goto('/login')
		await page
			.locator('[data-testid="login-form-token"]')
			.fill('dev-token-only')
		await page.locator('[data-testid="login-form-submit"]').click()
		await page.waitForTimeout(100)
		await page.goto('/')

		// test create a new task -> it shows up in the task list.
		await page.click('[data-testid="create-task-button"]')

		// assert the new-task-modal is visible
		await expect(
			page.locator('[data-testid="new-task-modal-overlay"]'),
		).toBeVisible()

		// fill the form fields and type enter to submit
		const randomTaskName = `test-task-${Math.floor(Math.random() * 1000)}`
		await page
			.locator('[data-testid="new-task-form-name"]')
			.fill(randomTaskName)

		// set seconds field to 3 seconds
		await page.locator('[data-testid="new-task-form-seconds"]').fill('2')

		await page.locator('[data-testid="new-task-modal-create-btn"]').click()

		// wait for the new task to appear in the task list
		await expect(
			page.locator(`[data-testid="task-card-${randomTaskName}"]`),
		).toBeVisible({
			timeout: 5000,
		})

		// click on the new task to open the time modal
		await page
			.locator(`[data-testid="task-card-${randomTaskName}"]`)
			.click()

		// assert the time modal is visible
		await expect(
			page.locator('[data-testid="time-modal-overlay"]'),
		).toBeVisible()

		// assert the time modal label shows 00:03
		await expect(
			page.locator('[data-testid="time-modal-label"]'),
		).toHaveText('00:02', {
			timeout: 5000,
		})

		// click on start button -> assert the label starts counting down
		await page
			.locator('[data-testid="time-modal-start-stop-button"]')
			.click()

		expect(
			await page
				.locator('[data-testid="time-modal-start-stop-button"]')
				.innerText(),
		).toBe('Stop')

		await expect(
			page.locator('[data-testid="time-modal-start-stop-button"]'),
		).toHaveText('Start', {
			timeout: 5000,
		})

		// assert the test task card has a "completed" badge after the timer ends
		await expect(
			page.locator(
				`[data-testid="task-card-${randomTaskName}-checkbox"]`,
			),
		).toBeChecked({
			timeout: 5000,
		})

		// reload the page and assert the task is still completed (signals the task completion state is persisted)
		await page.reload()

		await expect(
			page.locator(
				`[data-testid="task-card-${randomTaskName}-checkbox"]`,
			),
		).toBeChecked({
			timeout: 5000,
		})

		// click on the task card again to open the time modal and assert the mode is switched to short break after the work timer ended
		await page
			.locator(`[data-testid="task-card-${randomTaskName}"]`)
			.click()

		// check the aria-activate attribute of the short break button in the view switch is true (signals the mode switched to short break after the work timer ended)
		await expect(
			page.locator(
				'[data-testid="time-modal-view-switch-btn-shortBreak"]',
			),
		).toHaveAttribute('aria-checked', 'true')

		// close the time modal
		await page
			.locator('[data-testid="time-modal-overlay"]')
			.click({ position: { x: 10, y: 10 } })

		// assert the time modal is closed
		await expect(
			page.locator('[data-testid="time-modal-overlay"]'),
		).not.toBeVisible({
			timeout: 5000,
		})

		// open the time modal again by clicking the task card
		await page
			.locator(`[data-testid="task-card-${randomTaskName}"]`)
			.click()

		// assert the mode is shortBreak
		await expect(
			page.locator(
				'[data-testid="time-modal-view-switch-btn-shortBreak"]',
			),
		).toHaveAttribute('aria-checked', 'true')

		// close the time modal
		await page
			.locator('[data-testid="time-modal-overlay"]')
			.click({ position: { x: 10, y: 10 } })

		// create 2 other tasks for testing the order of tasks
		const taskNames = []
		for (let i = 0; i < 2; i++) {
			const taskName = `test-task-${Math.floor(Math.random() * 1000)}`
			taskNames.push(taskName)
			await page.click('[data-testid="create-task-button"]')
			await page
				.locator('[data-testid="new-task-form-name"]')
				.fill(taskName)
			await page
				.locator('[data-testid="new-task-form-seconds"]')
				.fill('3')
			await page
				.locator('[data-testid="new-task-modal-create-btn"]')
				.click()
			await expect(
				page.locator(`[data-testid="task-card-${taskName}"]`),
			).toBeVisible({
				timeout: 5000,
			})
		}

		// delete all 3 test tasks
		for (const taskName of [randomTaskName, ...taskNames]) {
			await page
				.locator(`[data-testid="task-card-${taskName}-option"]`)
				.click()
			await page
				.locator(`[data-testid="task-card-${taskName}-delete"]`)
				.click()

			// // confirm the delete action in the modal
			// await page
			// 	.locator('[data-testid="delete-validate-modal-confirm"]')
			// 	.click()

			// assert the task card is removed from the DOM
			await expect(
				page.locator(`[data-testid="task-card-${taskName}"]`),
			).not.toBeVisible({
				timeout: 5000,
			})
		}
	})
})
