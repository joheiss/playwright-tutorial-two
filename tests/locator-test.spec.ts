import { expect, test } from '@playwright/test';



test.describe('use a locator', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test('get an html element via locator', async ({ page }) => {
    // by tag name
    const inputs = page.locator('input');
    expect(inputs).toBeTruthy();
    // click on the 1st input field
    inputs.first().click();

    // by id
    const input1 = page.locator('#inputEmail1');
    expect(input1).toBeTruthy();
    await input1.click();

    // by class name
    const rectangles = page.locator('.shape-rectangle');
    expect(rectangles).toBeTruthy();

    // by attribute
    const emailFields = page.locator('[placeholder="Email"]');
    expect(emailFields).toBeTruthy();

    // by full class names
    const inputFields = page.locator('["input-full-width size-medium status-basic shape-rectangle nb-transition"]');
    expect(inputFields).toBeTruthy();

    // by combination
    const emailInput = page.locator('input[placeholder="Email"].shape-rectangle');
    expect(emailInput).toBeTruthy();

    // by XPath -> NOT RECOMMENDED
    const xPath = page.locator('//*[@id="inputEmail1"]');
    expect(xPath).toBeDefined();

    // by exact text match
    const exactMatch = page.locator(':text-is("Using the grid")');
    expect(exactMatch).not.toBeUndefined();

    // by partial text content
    const text = page.locator(':text("Using the")');
    expect(text).not.toBeFalsy();
  });

  test('user facing -> get element by role', async ({ page }) => {
    // 1st email field
    const emailTextbox = page.getByRole('textbox', { name: "Email" }).first();
    expect(emailTextbox).toBeTruthy();
    await emailTextbox.click();

    // 1st sign-in button
    const signInButton = page.getByRole('button', { name: "sign in" }).first();
    expect(signInButton).toBeDefined();
    await signInButton.click();
  });

  test('user facing -> get element by label', async ({ page }) => {
    // 1st password field
    const passwordTextbox = page.getByLabel('Password').first();
    expect(passwordTextbox).toBeTruthy();
    await passwordTextbox.click();
  });


  test('user facing -> get element by placeholder', async ({ page }) => {
    // 1st field
    const janeDoeTextbox = page.getByPlaceholder('jane doe');
    expect(janeDoeTextbox).toBeTruthy();
    await janeDoeTextbox.click();
  });

  test('user facing -> get element by text', async ({ page }) => {
    // 1st field with text ...
    const subForm = page.getByText('form without labels');
    expect(subForm).toBeTruthy();
    await subForm.click();
  });

  test('user facing -> get element by title', async ({ page }) => {
    // Iot Dashboard
    const menuItem = page.getByTitle('IoT Dashboard');
    expect(menuItem).toBeTruthy();
    await menuItem.click();
  });

  test('not really user facing -> get element by test id', async ({ page }) => {
    // marked sign in button
    const btn = page.getByTestId('SignIn');
    expect(btn).toBeTruthy();
    await btn.click();
  });

  test('get a child element - with a single locator', async ({ page }) => {
    const radioButton = page.locator('nb-card nb-radio :text-is("Option 1")');
    expect(radioButton).toBeDefined();
    await radioButton.click();
  });

  test('get a child element - with chained locators', async ({ page }) => {
    const radioButton2 = page.locator('nb-card')
      .locator('nb-radio')
      .locator(':text-is("Option 2")');
    expect(radioButton2).toBeDefined();
    await radioButton2.click();
  });

  test('get a child element - with mix of locators and user facing locators', async ({ page }) => {
    const button = page.locator('nb-card')
      .getByRole('button', { name: "sign in" })
      .first();
    expect(button).toBeDefined();
    await button.click();
  });

  test('get a child element - with mix of locators and index of elemen -- NOT RECOMMENDED', async ({ page }) => {
    const button = page.locator('nb-card')
      .nth(3)
      .getByRole('button')
      .first();
    expect(button).toBeDefined();
    await button.click();
  });

  test('locate parent element(s) - ', async ({ page }) => {
    const card = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" });
    expect(card).toBeDefined();
    await card.click();
  });

  test('locate parent element(s) - with nested locators', async ({ page }) => {
    const card = page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" });
    expect(card).toBeDefined();
    await card.click();
  });

  test('locate parent element(s) - with filter', async ({ page }) => {
    const button = page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('button');
    expect(button).toBeDefined();
    await button.click();
  });

  test('locate parent element(s) - with filter using sub-locator', async ({ page }) => {
    const checkbox = page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Email" });
    expect(checkbox).toBeDefined();
    await checkbox.click();
  });

  test('locate parent element(s) - with nested filters', async ({ page }) => {
    const countFound = await page.locator('nb-card')
      .filter({ has: page.locator('nb-checkbox') })
      .filter({ hasText: "sign in" })
      .count();
    console.log('COUNT: ' + countFound);

    const emailField = page.locator('nb-card')
      // .filter({ hasText: "Horizontal form" })
      .filter({ has: page.locator('nb-checkbox') })
      // .last()
      .filter({ hasText: "sign in" })
      .getByRole('textbox', { name: "Email" });
    expect(emailField).toBeDefined();
    await emailField.click();
  });

  test('locate parent element(s) - with xPath', async ({ page }) => {
    const emailField = page.locator(':text-is("Using the Grid")')
      .locator('..')
      .getByRole('textbox', { name: "Email" });
    expect(emailField).toBeDefined();
    await emailField.click();
  });

  test('reusing locators - ', async ({ page }) => {
    const form = page.locator('nb-card')
      .filter({ hasText: "Basic form" });
    const emailTextField = form.getByRole('textbox', { name: "Email" });
    await emailTextField.fill("test@testing.com");

    const passwordTextField = form.getByRole('textbox', { name: "Password" });
    await passwordTextField.fill("super-secret");

    const checkbox = form.locator('nb-checkbox');
    await checkbox.click();

    const button = form.getByRole('button', { name: "submit" });
    await button.click();

    await expect(emailTextField).toHaveValue("test@testing.com");
  });
});
