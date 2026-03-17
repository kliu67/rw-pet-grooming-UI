import { expect, test } from "@playwright/test";

test("clients route shows login-required state when unauthenticated", async ({ page }) => {
  await page.goto("/clients");

  await expect(
    page.getByText(/please log in to view content|general\.loginRequireMessage/i),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: /add client|clients\.add/i }),
  ).toHaveCount(0);
});
