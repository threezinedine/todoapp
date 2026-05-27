import { test, expect, type Page } from '@playwright/test'

async function openCreateTaskModal(page: Page) {
	await page.click('[data-testid="add-button"]')
	await page.click('[data-testid="add-task-dropdown-item"]')

	await expect(
		page.locator('[data-testid="new-task-modal-overlay"]'),
	).toBeVisible()
}

async function createNewTask(page: Page, taskName: string, seconds?: number) {
	await openCreateTaskModal(page)

	await page.locator('[data-testid="new-task-form-name"]').fill(taskName)

	if (typeof seconds === 'number') {
		await page
			.locator('[data-testid="new-task-form-seconds"]')
			.fill(String(seconds))
	}

	await page.locator('[data-testid="new-task-modal-create-btn"]').click()

	await expect(
		page.locator(`[data-testid="task-card-${taskName}"]`),
	).toBeVisible({
		timeout: 5000,
	})
}

function createRandomTaskName() {
	return `test-task-${Math.floor(Math.random() * 1000)}`
}

async function openTimeModalByTaskName(page: Page, taskName: string) {
	await page.locator(`[data-testid="task-card-${taskName}"]`).click()
	await expect(
		page.locator('[data-testid="time-modal-overlay"]'),
	).toBeVisible()
}

async function clickStartButtonInTimeModal(page: Page, waitForLabel?: string) {
	await page.locator('[data-testid="time-modal-start-stop-button"]').click()

	if (waitForLabel) {
		await expect(
			page.locator('[data-testid="time-modal-start-stop-button"]'),
		).toHaveText(waitForLabel, {
			timeout: 5000,
		})
	}
}

async function closeTimeModal(page: Page) {
	await page
		.locator('[data-testid="time-modal-overlay"]')
		.click({ position: { x: 10, y: 10 } })

	await expect(
		page.locator('[data-testid="time-modal-overlay"]'),
	).not.toBeVisible({
		timeout: 5000,
	})
}

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
		const randomTaskName = createRandomTaskName()
		await createNewTask(page, randomTaskName, 2)

		// click on the new task to open the time modal
		await openTimeModalByTaskName(page, randomTaskName)

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
		await openTimeModalByTaskName(page, randomTaskName)

		// check the aria-activate attribute of the short break button in the view switch is true (signals the mode switched to short break after the work timer ended)
		await expect(
			page.locator(
				'[data-testid="time-modal-view-switch-btn-shortBreak"]',
			),
		).toHaveAttribute('aria-checked', 'true')

		await closeTimeModal(page)

		// open the time modal again by clicking the task card
		await openTimeModalByTaskName(page, randomTaskName)

		// assert the mode is shortBreak
		await expect(
			page.locator(
				'[data-testid="time-modal-view-switch-btn-shortBreak"]',
			),
		).toHaveAttribute('aria-checked', 'true')

		await closeTimeModal(page)

		const TEST_CARD_COUNT = 4

		// create remain TEST_CARD_COUNT - 1 other tasks for testing the order of tasks
		const taskNames = []
		for (let i = 0; i < TEST_CARD_COUNT - 1; i++) {
			const taskName = createRandomTaskName()
			taskNames.push(taskName)
			await createNewTask(page, taskName, 3)
		}

		// delete the first task by single task card interaction
		await page
			.locator(`[data-testid="task-card-${randomTaskName}-option"]`)
			.click()
		await page
			.locator(`[data-testid="task-card-${randomTaskName}-delete"]`)
			.click()

		// confirm the delete action in the modal
		await page
			.locator(
				`[data-testid="task-card-${randomTaskName}-delete-validate-modal-confirm"]`,
			)
			.click()

		// assert no visible time modal exists (signals the modal is closed after confirming delete)
		await expect(
			page.locator('[data-testid="time-modal-overlay"]'),
		).not.toBeVisible({
			timeout: 5000,
		})

		// assert the task card is removed from the DOM
		await expect(
			page.locator(`[data-testid="task-card-${randomTaskName}"]`),
		).not.toBeVisible({
			timeout: 5000,
		})

		openTimeModalByTaskName(page, taskNames[1]) // open the second task

		// start the second task's timer
		await page
			.locator('[data-testid="time-modal-start-stop-button"]')
			.click()

		// wait until move to short break
		await expect(
			page.locator(
				'[data-testid="time-modal-view-switch-btn-shortBreak"]',
			),
		).toHaveAttribute('aria-checked', 'true', {
			timeout: 10000,
		})

		// start the short break timer
		await page
			.locator('[data-testid="time-modal-start-stop-button"]')
			.click()

		// wait until move to work with the name of the third task
		await expect(
			page.locator('[data-testid="time-modal-label"]'),
		).toHaveText('00:03', {
			timeout: 10000,
		})

		await expect(
			page.locator('[data-testid="time-modal-task-name"]'),
		).toHaveText(taskNames[2], {
			timeout: 5000,
		})

		closeTimeModal(page)

		// delete all remaining test tasks by multiple choice
		await page.click('[data-testid="select-tasks-button"]') // switch to select mode

		for (const taskName of taskNames) {
			await page.locator(`[data-testid="task-card-${taskName}"]`).click()
		}

		await page.click('[data-testid="delete-selected-tasks-button"]')

		// confirm the delete action in the modal
		await page
			.locator(
				'[data-testid="delete-selected-tasks-confirm-modal-confirm"]',
			)
			.click()

		for (const taskName of taskNames) {
			await expect(
				page.locator(`[data-testid="task-card-${taskName}"]`),
			).not.toBeVisible({
				timeout: 5000,
			})
		}
	})
})
