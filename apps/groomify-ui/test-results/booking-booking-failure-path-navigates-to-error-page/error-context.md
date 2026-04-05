# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> booking failure path navigates to error page
- Location: e2e\booking.spec.ts:254:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('open-booking').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByTestId('open-booking').first()

```

# Test source

```ts
  92  | 
  93  |     if (method === "GET" && pathname === "/api/breeds") {
  94  |       return route.fulfill({
  95  |         status: 200,
  96  |         contentType: "application/json",
  97  |         body: JSON.stringify(breeds),
  98  |       });
  99  |     }
  100 | 
  101 |     if (method === "GET" && pathname === "/api/weightClasses") {
  102 |       return route.fulfill({
  103 |         status: 200,
  104 |         contentType: "application/json",
  105 |         body: JSON.stringify(weightClasses),
  106 |       });
  107 |     }
  108 | 
  109 |     if (
  110 |       method === "GET" &&
  111 |       pathname.startsWith("/api/availability/stylist/")
  112 |     ) {
  113 |       return route.fulfill({
  114 |         status: 200,
  115 |         contentType: "application/json",
  116 |         body: JSON.stringify(availability),
  117 |       });
  118 |     }
  119 | 
  120 |     if (
  121 |       method === "GET" &&
  122 |       pathname.startsWith("/api/timeOffs/stylist/") &&
  123 |       pathname.endsWith("/upcoming")
  124 |     ) {
  125 |       return route.fulfill({
  126 |         status: 200,
  127 |         contentType: "application/json",
  128 |         body: JSON.stringify([]),
  129 |       });
  130 |     }
  131 | 
  132 |     if (
  133 |       method === "GET" &&
  134 |       pathname.startsWith("/api/appointments/stylist/") &&
  135 |       pathname.endsWith("/upcoming")
  136 |     ) {
  137 |       return route.fulfill({
  138 |         status: 200,
  139 |         contentType: "application/json",
  140 |         body: JSON.stringify([]),
  141 |       });
  142 |     }
  143 | 
  144 |     if (method === "GET" && pathname === "/api/serviceConfigurations") {
  145 |       return route.fulfill({
  146 |         status: 200,
  147 |         contentType: "application/json",
  148 |         body: JSON.stringify(serviceConfig),
  149 |       });
  150 |     }
  151 | 
  152 |     if (method === "POST" && pathname === "/api/appointments/from-scratch") {
  153 |       if (options.failBooking) {
  154 |         return route.fulfill({
  155 |           status: 500,
  156 |           contentType: "application/json",
  157 |           body: JSON.stringify({ error: "Booking failed" }),
  158 |         });
  159 |       }
  160 | 
  161 |       return route.fulfill({
  162 |         status: 200,
  163 |         contentType: "application/json",
  164 |         body: JSON.stringify({ id: 555 }),
  165 |       });
  166 |     }
  167 | 
  168 |     if (
  169 |       method === "GET" &&
  170 |       pathname.startsWith("/api/appointmentConfirmations/")
  171 |     ) {
  172 |       return route.fulfill({
  173 |         status: 200,
  174 |         contentType: "application/json",
  175 |         body: JSON.stringify(confirmation),
  176 |       });
  177 |     }
  178 | 
  179 |     return route.fulfill({
  180 |       status: 404,
  181 |       contentType: "application/json",
  182 |       body: JSON.stringify({ error: "Not mocked" }),
  183 |     });
  184 |   });
  185 | 
  186 |   return { tomorrow };
  187 | }
  188 | 
  189 | async function openBookingModal(page) {
  190 |   await page.goto("/");
  191 |   const bookingTrigger = page.getByTestId("open-booking").first();
> 192 |   await expect(bookingTrigger).toBeVisible({ timeout: 15000 });
      |                                ^ Error: expect(locator).toBeVisible() failed
  193 |   await bookingTrigger.click();
  194 | }
  195 | 
  196 | async function completeBookingSteps(page, tomorrow: Date) {
  197 |   await page.getByRole("button", { name: /full groom/i }).click();
  198 | 
  199 |   await page
  200 |     .getByPlaceholder("Enter your pet's name")
  201 |     .fill("Buddy");
  202 | 
  203 |   await page
  204 |     .getByRole("button", { name: "Select your pet's breed" })
  205 |     .click();
  206 |   await page.getByRole("option", { name: "Poodle" }).click();
  207 | 
  208 |   await page
  209 |     .getByRole("button", { name: "Select your pet's weight" })
  210 |     .click();
  211 |   const configResponsePromise = page.waitForResponse((response) =>
  212 |     response.url().includes("/api/serviceConfigurations"),
  213 |   );
  214 |   await page.getByRole("option", { name: /small/i }).click();
  215 |   await configResponsePromise;
  216 | 
  217 |   await page.getByRole("button", { name: "Next" }).click();
  218 | 
  219 |   await page
  220 |     .getByRole("button", { name: formatDayLabel(tomorrow) })
  221 |     .click();
  222 | 
  223 |   const firstBookable = page.locator(
  224 |     "#time-picker [data-bookable=\"true\"] button",
  225 |   ).first();
  226 |   await expect(firstBookable).toBeVisible();
  227 |   await firstBookable.click();
  228 | 
  229 |   await page.getByRole("button", { name: "Next" }).click();
  230 | 
  231 |   await page.getByPlaceholder("Enter your first name").fill("Taylor");
  232 |   await page.getByPlaceholder("Enter your last name").fill("Smith");
  233 |   await page.getByPlaceholder("Enter your phone").fill("780-893-1007");
  234 |   await page.getByPlaceholder("Enter your email").fill("taylor@example.com");
  235 | 
  236 |   await page.getByRole("button", { name: "Next" }).click();
  237 | }
  238 | 
  239 | test("booking success path navigates to confirmation", async ({ page }) => {
  240 |   const { tomorrow } = await mockBookingApis(page);
  241 | 
  242 |   await openBookingModal(page);
  243 |   await completeBookingSteps(page, tomorrow);
  244 | 
  245 |   await page.getByRole("button", { name: "Submit" }).click();
  246 | 
  247 |   await page.waitForURL(/\/confirmation\/555$/);
  248 |   await expect(
  249 |     page.getByRole("heading", { name: "Booking Confirmed!" }),
  250 |   ).toBeVisible();
  251 |   await expect(page.getByText("CONF-123")).toBeVisible();
  252 | });
  253 | 
  254 | test("booking failure path navigates to error page", async ({ page }) => {
  255 |   const { tomorrow } = await mockBookingApis(page, { failBooking: true });
  256 | 
  257 |   await openBookingModal(page);
  258 |   await completeBookingSteps(page, tomorrow);
  259 | 
  260 |   await page.getByRole("button", { name: "Submit" }).click();
  261 | 
  262 |   await page.waitForURL(/\/error$/);
  263 |   await expect(
  264 |     page.getByRole("heading", { name: "Booking Error" }),
  265 |   ).toBeVisible();
  266 | });
  267 | 
```