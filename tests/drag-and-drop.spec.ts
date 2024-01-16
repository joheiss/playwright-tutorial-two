import { test, expect } from "@playwright/test";

test.describe("Drag and Drop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");
  });

  test("drag and drop with iFrame", async ({ page }) => {
    await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

    const iframe = page.frameLocator('[rel-title="Photo Manager"] iframe');
    // const image = iframe.getByRole("listitem", { name: "High Tatras 2" });
    // expect(image).toBeTruthy();
    // const trash = iframe.locator("#trash");
    // expect(trash).toBeDefined();
    // await image.dragTo(trash);
    await iframe
      .locator("li", { hasText: "High Tatras 2" })
      .dragTo(iframe.locator("#trash"));
  });

  test("drag and drop with iFrame - simulating mouse movements", async ({
    page,
  }) => {
    await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

    const iframe = page.frameLocator('[rel-title="Photo Manager"] iframe');
    await iframe.locator("li", { hasText: "High Tatras 4" }).hover();
    await page.mouse.down();
    await iframe.locator("#trash").hover();
    await page.mouse.up();
    expect(iframe.locator("#trash").locator("li").first()).toBeDefined();
  });
});
