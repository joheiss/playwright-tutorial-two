import { test } from '@playwright/test';


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test.describe('test the Forms', () => {

  test.beforeAll(() => {
    console.log("BEFORE ALL ...");
  });

  test.beforeEach(async ({ page }) => {
    await page.getByText('Forms').click();
  });

  test('navigate to form layouts payge', async ({ page }) => {
    await page.getByText('Form Layouts').click();
  });

  test('navigate to date picker page', async ({ page }) => {
    await page.getByText('Datepicker').click();
  });

  // afterEach & adterAll are usually a bad practice - use beforeAll or beforeEach if possible
  test.afterEach(() => {
    console.log("AFTER EACH ...");
  });

  test.afterAll(() => {
    console.log("AFTER ALL ...");
  });
});
