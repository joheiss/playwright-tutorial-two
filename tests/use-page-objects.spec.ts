import { test } from "@playwright/test";
import { PageManager } from "../page-objects/page-manager";
test.describe("Use a page object", () => {
  let pm: PageManager;

  test.beforeAll(async ({ page }) => {
    pm = new PageManager(page);
  });
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200");
  });

  test("Navigate to From Layouts page", async ({ page }) => {
    await pm.navigationPage.gotoFormLayoutsPage();
    await pm.navigationPage.gotoDatePickerPage();
  });

  test("Submit form with values", async ({ page }) => {
    await pm.navigationPage.gotoFormLayoutsPage();
    await pm.formLayoutsPage.submitUsingTheGridFormWithCredsAndSelectOption(
      "test@testing.company",
      "secret",
      "Option 1"
    );
  });

  test("Submit another form with values", async ({ page }) => {
    await pm.navigationPage.gotoFormLayoutsPage();
    await pm.formLayoutsPage.submitInlineFormWithNameEmailAndRememberMe(
      "Hansi Hanselmann",
      "hansi@horsti.de",
      true
    );
  });

  test("Submit another form with values and optional parameters", async ({
    page,
  }) => {
    await pm.navigationPage.gotoFormLayoutsPage();
    await pm.formLayoutsPage.submitInlineFormWithNameEmailAndRememberMe(
      "Hansi Hanselmann",
      "hansi@horsti.de"
    );
  });

  test("Select date in date picker", async ({ page }) => {
    await pm.navigationPage.gotoDatePickerPage();
    await pm.datePickerPage.selectDateFromToday(7);
  });

  test("Select date range in date range picker", async ({ page }) => {
    await pm.navigationPage.gotoDatePickerPage();
    await pm.datePickerPage.selectDateRangeFromToday(7, 10);
  });
});
