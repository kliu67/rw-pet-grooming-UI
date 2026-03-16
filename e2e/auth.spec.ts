import { test, expect } from "@playwright/test";

test("user can open login modal", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByLabel(/email|login\.email/i)).toBeVisible();
  await expect(page.getByLabel(/password|login\.password/i)).toBeVisible();
});

test("user can log in with seeded credentials", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  test.skip(!email || !password, "Set E2E_USER_EMAIL and E2E_USER_PASSWORD");

  await page.goto("/");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByLabel(/email|login\.email/i).fill(email as string);
  await page.getByLabel(/password|login\.password/i).fill(password as string);

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/auth/login") &&
      response.request().method() === "POST",
  );

  // Submit the login form deterministically (avoids matching tab/sidebar "Login" buttons).
  await page.locator("button[type='submit'][aria-busy]").first().click();

  const loginResponse = await loginResponsePromise;
  if (!loginResponse.ok()) {
    const body = await loginResponse.text();
    throw new Error(
      `Login request failed with status ${loginResponse.status()}: ${body}`,
    );
  }

  // Fail fast with a useful signal instead of waiting for the default 30s timeout.
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible({
    timeout: 10000,
  });
});
