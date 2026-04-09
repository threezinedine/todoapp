import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/client/);
  });
});
