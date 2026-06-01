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

async function submitLoginToken(page: Page, token: string) {
	await page.locator('[data-testid="login-form-token"]').fill(token)
	await page.locator('[data-testid="login-form-submit"]').click()
}

async function assertAndCloseLoginErrorModal(page: Page, message: string) {
	await expect(page.getByText('Login Failed')).toBeVisible({
		timeout: 5000,
	})

	await expect(page.getByText(message)).toBeVisible({
		timeout: 5000,
	})

	await page
		.locator('[data-testid="login-error-modal-overlay"]')
		.click({ position: { x: 10, y: 10 } })

	await expect(page.getByText('Login Failed')).not.toBeVisible({
		timeout: 5000,
	})
}

async function loginWithDevToken(page: Page) {
	await submitLoginToken(page, 'dev-token-only')
	await page.waitForURL('/')
}

async function assertTimeModalLabel(page: Page, value: string, timeout = 5000) {
	await expect(page.locator('[data-testid="time-modal-label"]')).toHaveText(
		value,
		{ timeout },
	)
}

async function assertTimeModalMode(
	page: Page,
	mode: 'work' | 'shortBreak' | 'longBreak',
	timeout = 5000,
) {
	await expect(
		page.locator(`[data-testid="time-modal-view-switch-btn-${mode}"]`),
	).toHaveAttribute('aria-checked', 'true', { timeout })
}

async function assertTaskCardCompleted(
	page: Page,
	taskName: string,
	checked = true,
) {
	if (checked) {
		await expect(
			page.locator(`[data-testid="task-card-${taskName}-checkbox"]`),
		).toBeChecked({
			timeout: 5000,
		})
	} else {
		await expect(
			page.locator(`[data-testid="task-card-${taskName}-checkbox"]`),
		).not.toBeChecked({
			timeout: 5000,
		})
	}
}

async function deleteTaskByCardMenu(page: Page, taskName: string) {
	await page.locator(`[data-testid="task-card-${taskName}-option"]`).click()
	await page.locator(`[data-testid="task-card-${taskName}-delete"]`).click()
	await page
		.locator(
			`[data-testid="task-card-${taskName}-delete-validate-modal-confirm"]`,
		)
		.click()
}

async function selectTasksForBulkDelete(page: Page, taskNames: string[]) {
	await clickOnSelectButton(page)

	for (const taskName of taskNames) {
		await page.locator(`[data-testid="task-card-${taskName}"]`).click()
	}

	await page.click('[data-testid="delete-selected-tasks-button"]')
	await page
		.locator('[data-testid="delete-selected-tasks-confirm-modal-confirm"]')
		.click()
}

async function clickOnSelectButton(page: Page) {
	await page.click('[data-testid="select-tasks-button"]')
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

async function clickNextPeriodButton(page: Page) {
	await page.locator(`[data-testid="next-period-button"]`).click()
}

async function clickPreviousPeriodButton(page: Page) {
	await page.locator(`[data-testid="previous-period-button"]`).click()
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
		await submitLoginToken(page, 'wrong-token')

		// verify the modal container is attached to the DOM
		await expect(
			page.locator('[data-testid="login-error-modal"]'),
		).toBeAttached()
		await assertAndCloseLoginErrorModal(page, 'Unauthorized')

		// clear the token input
		await page.locator('[data-testid="login-form-token"]').fill('')

		// press the submit button again without filling the token
		await page.locator('[data-testid="login-form-submit"]').click()
		await assertAndCloseLoginErrorModal(page, 'Token is required.')

		await loginWithDevToken(page)

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
		await submitLoginToken(page, 'dev-token-only')
		await page.waitForTimeout(100)
		await page.goto('/')

		// test create a new task -> it shows up in the task list.
		const randomTaskName = createRandomTaskName()
		await createNewTask(page, randomTaskName, 4)

		// click on the new task to open the time modal
		await openTimeModalByTaskName(page, randomTaskName)

		// assert the time modal label shows 00:04
		await assertTimeModalLabel(page, '00:04')

		// click on start button -> assert the label starts counting down
		await clickStartButtonInTimeModal(page)

		await assertTaskCardCompleted(page, randomTaskName, false) // assert the task is not completed while the timer is running

		expect(
			await page
				.locator('[data-testid="time-modal-start-stop-button"]')
				.innerText(),
		).toBe('Stop')

		await assertTimeModalLabel(page, '00:03') // assert the label is counting down

		await clickStartButtonInTimeModal(page, 'Start') // click stop and assert the button text changes to Start

		await assertTaskCardCompleted(page, randomTaskName, false) // assert the task is still not completed after stopping the timer

		await clickStartButtonInTimeModal(page, 'Stop') // click start again

		// assert the test task card has a "completed" badge after the timer ends
		await assertTaskCardCompleted(page, randomTaskName)

		// reload the page and assert the task is still completed (signals the task completion state is persisted)
		await page.reload()

		await assertTaskCardCompleted(page, randomTaskName)

		// click on the task card again to open the time modal and assert the mode is switched to short break after the work timer ended
		await openTimeModalByTaskName(page, randomTaskName)

		// check the aria-activate attribute of the short break button in the view switch is true (signals the mode switched to short break after the work timer ended)
		await assertTimeModalMode(page, 'shortBreak')

		await closeTimeModal(page)

		// open the time modal again by clicking the task card
		await openTimeModalByTaskName(page, randomTaskName)

		// assert the mode is shortBreak
		await assertTimeModalMode(page, 'shortBreak')

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
		await deleteTaskByCardMenu(page, randomTaskName)

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

		await openTimeModalByTaskName(page, taskNames[1]) // open the second task

		// start the second task's timer
		await clickStartButtonInTimeModal(page)

		// wait until move to short break
		await assertTimeModalMode(page, 'shortBreak', 10000)

		// start the short break timer
		await clickStartButtonInTimeModal(page)

		// wait until move to work with the name of the third task
		await assertTimeModalLabel(page, '00:03', 10000)

		await expect(
			page.locator('[data-testid="time-modal-task-name"]'),
		).toHaveText(taskNames[2], {
			timeout: 5000,
		})

		// start the timer and wait until the end of the third task's timer to assert the auto-switching between tasks and modes works correctly
		await clickStartButtonInTimeModal(page)

		await assertTimeModalMode(page, 'shortBreak', 15000) // wait until move to short break

		await clickStartButtonInTimeModal(page) // start the short break timer

		await assertTimeModalMode(page, 'work', 10000) // wait until move to work

		// assert the task name now is the first task
		await expect(
			page.locator('[data-testid="time-modal-task-name"]'),
		).toHaveText(taskNames[0], {
			timeout: 5000,
		})

		await closeTimeModal(page)

		// delete all remaining test tasks by multiple choice
		await selectTasksForBulkDelete(page, taskNames)

		for (const taskName of taskNames) {
			await expect(
				page.locator(`[data-testid="task-card-${taskName}"]`),
			).not.toBeVisible({
				timeout: 5000,
			})
		}

		await clickOnSelectButton(page) // click select button to exit the multiple choice mode

		// work with other day
		await clickNextPeriodButton(page) // move to the next day

		const nextDayTaskName = createRandomTaskName()
		await createNewTask(page, nextDayTaskName)

		await expect(
			page.locator(`[data-testid="task-card-${nextDayTaskName}"]`),
		).toBeVisible({
			timeout: 5000,
		})
	})
})
