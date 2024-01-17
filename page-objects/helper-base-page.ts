import { Page } from "@playwright/test";

export class HelperBasePage {
  constructor(protected readonly page: Page) {}

  public async waitForSeconds(seconds: number): Promise<void> {
    this.page.waitForTimeout(seconds * 1000);
  }
}
