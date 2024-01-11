import test, { Locator, expect } from "@playwright/test";

test.describe('extracting values ...', () => {

  let basicForm: Locator;
  let gridForm: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();

    basicForm = page.locator('nb-card')
      .filter({ hasText: "Basic form" });

    gridForm = page.locator('nb-card')
      .filter({ hasText: "Using the Grid" });

  });

  test('extract single text from button', async ({ page }) => {
    const buttonText = await basicForm.getByRole('button').textContent();
    expect(buttonText.toLowerCase()).toEqual("submit");
  });

  test('extract all text from a group of radiobuttons', async ({ page }) => {
    const radioButtonTexts = await gridForm.locator('nb-radio').allTextContents();
    expect(radioButtonTexts).toContain("Option 1");
    expect(radioButtonTexts).toContain("Option 2");
  });

  test('extract value from an input field', async ({ page }) => {
    const emailField = await basicForm.getByRole('textbox', { name: "Email" });
    await emailField.fill("test@testing.com");
    const value = await emailField.inputValue();
    expect(value).toEqual("test@testing.com");

    // extract attribute value
    const placeholder = await emailField.getAttribute("placeholder");
    expect(placeholder).toEqual("Email");
  });

});
