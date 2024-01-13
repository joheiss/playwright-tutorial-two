import { test, expect, Locator } from '@playwright/test';

// -- navigate to web site under test
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form Layouts page", () => {

  let gridForm: Locator;

  test.beforeEach(async ({ page }) => {
    // navigate to Form Layouts page - via menu
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();

    gridForm = page.locator('nb-card', { hasText: "Using the Grid" });
  });

  test('Input fields', async ({ page }) => {
    const gridEmailInputField = gridForm.getByRole("textbox", { name: "Email" });
    await gridEmailInputField.fill("test@testing.com");
    const text = await gridEmailInputField.inputValue();
    expect(text).toEqual("test@testing.com");
    await gridEmailInputField.clear();
    // simulate the key strokes
    await gridEmailInputField.pressSequentially("test@testing.company");
    await gridEmailInputField.clear();
    // type slowly
    await gridEmailInputField.pressSequentially("test@testing-is-good.com", { delay: 300 });
    // locator assertions
    await expect(gridEmailInputField).toHaveValue("test@testing-is-good.com");
  });

  test('Radiobuttons', async ({ page }) => {
    const radioButton1 = gridForm.getByLabel("Option 1");
    // force is needed because option might be visually hidden
    await radioButton1.check({ force: true });

    const radioButton2 = gridForm.getByRole("radio", { name: "Option 2" });
    await radioButton2.check({ force: true });

    // test if radio button has been selected
    const status = await radioButton2.isChecked();
    expect(status).toBeTruthy();
    // ... or with locator assertion
    await expect(radioButton2).toBeChecked();
    await expect(radioButton1).not.toBeChecked();
  });

});

test.describe("Modal & Overlays page", () => {


  test.beforeEach(async ({ page }) => {
    // navigate to Form Layouts page - via menu
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();
  });

  test('Checkboxes', async ({ page }) => {

    const checkbox = page.getByRole("checkbox", { name: "Hide on click" });
    // CLICK toggles the checkbox
    await checkbox.click({ force: true });
    // CHECK checks the checkbox - if already checked it's not unchecked!
    await checkbox.check({ force: true });
    // UNCHECK a checkbox
    const checkbox3 = page.getByRole("checkbox", { name: "Show toast with icon" });
    await checkbox3.uncheck({ force: true });

    // loop thru all checkboxes
    const checkboxes = page.getByRole("checkbox");
    for (const cb of await checkboxes.all()) {
      await cb.click({ force: true });
    }
    await expect(page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" })).toBeChecked();
  });

});

