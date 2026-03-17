import { expect, test } from "@playwright/test";

test("shows auth failure for invalid credentials", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Login" }).first().click();
  await page.getByLabel(/email|login\.email/i).fill(
    `invalid-${Date.now()}@example.com`,
  );
  await page.getByLabel(/password|login\.password/i).fill("wrong-password-123");

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/auth/login") &&
      response.request().method() === "POST",
  );

  await page.locator("button[type='submit'][aria-busy]").first().click();
  const loginResponse = await loginResponsePromise;

  expect(loginResponse.status()).toBeGreaterThanOrEqual(400);

  await expect(
    page.getByText(/invalid email or password|toast\.loginInvalidEmailPassword/i),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toHaveCount(0);
});
