import { Locator, expect, test } from '@playwright/test';
test.describe('assertions ...', () => {

  let basicForm: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200");
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();

    basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
  });

  test('general assertions', async ({ page }) => {
    const value = 5;
    expect(value).toEqual(5);
  });

  test('locator assertions', async ({ page }) => {
    const basicFormButton = basicForm.getByRole('button');
    expect((await basicFormButton.textContent())).toEqual("Submit");
    await expect(basicFormButton).toHaveText("Submit");
  });

  test('soft assertions', async ({ page }) => {
    const basicFormButton = basicForm.getByRole('button');
    await expect.soft(basicFormButton).toHaveText("Xubmit");
    await basicFormButton.click();
  });

})
