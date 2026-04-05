import { expect, test } from "@playwright/test";

type BookingMocksOptions = {
  failBooking?: boolean;
};

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  return tomorrow;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function mockBookingApis(page, options: BookingMocksOptions = {}) {
  const tomorrow = getTomorrow();

  const services = [
    {
      id: 1,
      name: "Full Groom",
      description: "Full service grooming",
      base_price: 60,
      code: "FULL_GROOMING",
    },
  ];

  const breeds = [{ id: 1, name: "Poodle" }];

  const weightClasses = [
    {
      id: 1,
      label: "Small",
      weight_bounds: [0, 20],
    },
  ];

  const availability = [
    {
      date: tomorrow.toISOString(),
      start_time: "09:00",
      end_time: "17:00",
    },
  ];

  const serviceConfig = {
    id: 101,
    service_id: 1,
    breed_id: 1,
    weight_class_id: 1,
    duration_minutes: 60,
    buffer_minutes: 0,
    price: 75,
  };

  const confirmation = {
    appointment_number: "CONF-123",
    service_name: "Full Groom",
    start_time: tomorrow.toISOString(),
    duration_snapshot: 60,
    pet_name: "Buddy",
    breed_name: "Poodle",
    weight_class_label: "Small",
    service_base_price: 60,
    price_snapshot: 75,
    client_first_name: "Taylor",
    client_last_name: "Smith",
    client_email: "taylor@example.com",
    client_phone: "780-893-1007",
  };

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();

    if (method === "GET" && pathname === "/api/services") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(services),
      });
    }

    if (method === "GET" && pathname === "/api/breeds") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(breeds),
      });
    }

    if (method === "GET" && pathname === "/api/weightClasses") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(weightClasses),
      });
    }

    if (
      method === "GET" &&
      pathname.startsWith("/api/availability/stylist/")
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(availability),
      });
    }

    if (
      method === "GET" &&
      pathname.startsWith("/api/timeOffs/stylist/") &&
      pathname.endsWith("/upcoming")
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    }

    if (
      method === "GET" &&
      pathname.startsWith("/api/appointments/stylist/") &&
      pathname.endsWith("/upcoming")
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    }

    if (method === "GET" && pathname === "/api/serviceConfigurations") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(serviceConfig),
      });
    }

    if (method === "POST" && pathname === "/api/appointments/from-scratch") {
      if (options.failBooking) {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Booking failed" }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 555 }),
      });
    }

    if (
      method === "GET" &&
      pathname.startsWith("/api/appointmentConfirmations/")
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(confirmation),
      });
    }

    return route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ error: "Not mocked" }),
    });
  });

  return { tomorrow };
}

async function openBookingModal(page) {
  await page.goto("/");
  const bookingTrigger = page.getByTestId("open-booking").first();
  await expect(bookingTrigger).toBeVisible({ timeout: 15000 });
  await bookingTrigger.click();
}

async function completeBookingSteps(page, tomorrow: Date) {
  await page.getByRole("button", { name: /full groom/i }).click();

  await page
    .getByPlaceholder("Enter your pet's name")
    .fill("Buddy");

  await page
    .getByRole("button", { name: "Select your pet's breed" })
    .click();
  await page.getByRole("option", { name: "Poodle" }).click();

  await page
    .getByRole("button", { name: "Select your pet's weight" })
    .click();
  const configResponsePromise = page.waitForResponse((response) =>
    response.url().includes("/api/serviceConfigurations"),
  );
  await page.getByRole("option", { name: /small/i }).click();
  await configResponsePromise;

  await page.getByRole("button", { name: "Next" }).click();

  await page
    .getByRole("button", { name: formatDayLabel(tomorrow) })
    .click();

  const firstBookable = page.locator(
    "#time-picker [data-bookable=\"true\"] button",
  ).first();
  await expect(firstBookable).toBeVisible();
  await firstBookable.click();

  await page.getByRole("button", { name: "Next" }).click();

  await page.getByPlaceholder("Enter your first name").fill("Taylor");
  await page.getByPlaceholder("Enter your last name").fill("Smith");
  await page.getByPlaceholder("Enter your phone").fill("780-893-1007");
  await page.getByPlaceholder("Enter your email").fill("taylor@example.com");

  await page.getByRole("button", { name: "Next" }).click();
}

test("booking success path navigates to confirmation", async ({ page }) => {
  const { tomorrow } = await mockBookingApis(page);

  await openBookingModal(page);
  await completeBookingSteps(page, tomorrow);

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL(/\/confirmation\/555$/);
  await expect(
    page.getByRole("heading", { name: "Booking Confirmed!" }),
  ).toBeVisible();
  await expect(page.getByText("CONF-123")).toBeVisible();
});

test("booking failure path navigates to error page", async ({ page }) => {
  const { tomorrow } = await mockBookingApis(page, { failBooking: true });

  await openBookingModal(page);
  await completeBookingSteps(page, tomorrow);

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL(/\/error$/);
  await expect(
    page.getByRole("heading", { name: "Booking Error" }),
  ).toBeVisible();
});
