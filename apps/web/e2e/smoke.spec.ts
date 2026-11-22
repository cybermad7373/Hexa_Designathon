import { expect, test } from "@playwright/test";

test("landing page renders the operating system", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ten hours");
  await expect(page.getByRole("link", { name: /open the workflow/i })).toBeVisible();
  await expect(page.getByText("The 10-hour route")).toBeVisible();
});

test("health endpoint returns a structured payload", async ({ request }) => {
  const response = await request.get("/api/health");

  expect([200, 503]).toContain(response.status());
  const body = (await response.json()) as {
    service: string;
    status: string;
    requestId: string;
  };

  expect(body.service).toBe("hexa-web");
  expect(["ok", "degraded"]).toContain(body.status);
  expect(body.requestId).toMatch(/[0-9a-f-]{36}/);
});
