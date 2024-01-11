import { Locator, expect, test } from '@playwright/test';

test.describe('auto waiting ...', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("http://uitestingplayground.com/ajax");
    await page.getByText("Button Triggering AJAX Request").click();
  });

  test('auto waiting for success message', async ({ page }) => {
    const successButton = page.locator('.bg-success');
    await successButton.click();

    const text = await successButton.textContent();
    expect(text).toEqual("Data loaded with AJAX get request.");
  });

  test('auto waiting for success message - with method that does not support auto-waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success');
    // await successButton.click();

    // explicitly WAIT for button to be attached
    await successButton.waitFor({ state: "attached" });
    const text = await successButton.allTextContents();
    expect(text).toContain("Data loaded with AJAX get request.");
  });

  test('auto waiting for success message - with overriding the timeout', async ({ page }) => {
    const successButton = page.locator('.bg-success');
    // default timeout for locator assertions is 5 seconds -> increase it to 20 secs here
    await expect(successButton).toHaveText("Data loaded with AJAX get request.", { timeout: 20000 });
  });

  test('alternative waits -> wait for element', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    // wait for element
    await page.waitForSelector('.bg-success');

    // wait for specific response
    await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

    const text = await successButton.allTextContents();
    expect(text).toContain("Data loaded with AJAX get request.");
  });

  test('alternative waits -> wait for response ', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    // wait for specific response
    await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

    const text = await successButton.allTextContents();
    expect(text).toContain("Data loaded with AJAX get request.");
  });

  test('alternative waits -> wait for network calls -- NOT RECOMMENDED ', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    // wait for specific response
    await page.waitForLoadState("networkidle");

    const text = await successButton.allTextContents();
    expect(text).toContain("Data loaded with AJAX get request.");
  });

  test.describe('timeouts ...', () => {

    let successBtn: Locator;

    test.beforeEach(async ({ page }, testInfo) => {
      successBtn = page.locator('.bg-success');
      // set timeout for each test
      testInfo.setTimeout(testInfo.timeout + 1000);
    });

    test('default test timeout is 30 seconds', async ({ page }) => {
      // default test timeout is 30 seconds
      await successBtn.click();
    });

    test('action timeout set to 5 seconds in playwright.config.ts', async ({ page }) => {
      // override timeout in method
      await successBtn.click({ timeout: 16000 });
    });

    test('set timeout explicitly', async ({ page }) => {
      // explicitly set test timeout
      test.setTimeout(10000);
      await successBtn.click({ timeout: 16000 }); // will not work as test timeout < action timeout
    });

    test('explicitly mark a test as slow', async ({ page }) => {
      // explicitly mark test as slow -> increases the test timeout to 3x
      test.setTimeout(10000);
      test.slow();
      await successBtn.click(); // will work as test is marked as SLOW
    });


  });


});
