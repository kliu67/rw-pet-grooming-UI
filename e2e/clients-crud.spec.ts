import { expect, test } from "@playwright/test";

test("authenticated user can create a client", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  test.skip(!email || !password, "Set E2E_USER_EMAIL and E2E_USER_PASSWORD");

  await page.goto("/");
  await page.getByRole("button", { name: "Login" }).first().click();
  await page.getByLabel(/email|login\.email/i).fill(email as string);
  await page.getByLabel(/password|login\.password/i).fill(password as string);

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/auth/login") &&
      response.request().method() === "POST",
  );

  await page.locator("button[type='submit'][aria-busy]").first().click();
  const loginResponse = await loginResponsePromise;
  expect(loginResponse.ok()).toBeTruthy();

  await page.goto("/clients");
  await expect(
    page.getByRole("button", { name: /add client|clients\.add/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: /add client|clients\.add/i }).click();
  await expect(page.getByText(/create client|clients\.create/i)).toBeVisible();

  const suffix = `${Date.now()}`;
  await page.getByPlaceholder(/first name|clients\.placeholderText\.firstName/i).fill(`E2E${suffix}`);
  await page.getByPlaceholder(/last name|clients\.placeholderText\.lastName/i).fill("User");
  await page.getByPlaceholder(/phone|clients\.placeholderText\.phone/i).fill("12345678");
  await page.getByPlaceholder(/email|clients\.placeholderText\.email/i).fill(`e2e-${suffix}@example.com`);
  await page.getByPlaceholder(/description|clients\.placeholderText\.description/i).fill("Playwright client");

  const createResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/clients") &&
      response.request().method() === "POST",
  );

  await page.getByRole("button", { name: /create|general\.create/i }).click();
  const createResponse = await createResponsePromise;
  expect(createResponse.ok()).toBeTruthy();

  await expect(page.getByText(/create client|clients\.create/i)).toHaveCount(0);
});
