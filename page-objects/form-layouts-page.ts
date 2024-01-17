import { Page } from "@playwright/test";
import { HelperBasePage } from "./helper-base-page";

export class FormLayoutsPage extends HelperBasePage {
  public async submitUsingTheGridFormWithCredsAndSelectOption(
    email: string,
    password: string,
    optionText: string
  ): Promise<void> {
    const form = this.page.locator("nb-card", { hasText: "Using the Grid" });
    // fill email & password input field
    await form.getByRole("textbox", { name: "Email" }).fill(email);
    await form.getByRole("textbox", { name: "Password" }).fill(password);
    // select radio button
    await form.getByRole("radio", { name: optionText })?.check({ force: true });
    // press submit button
    await form.getByRole("button").click();
  }

  public async submitInlineFormWithNameEmailAndRememberMe(
    name: string,
    email: string,
    rememberMe?: boolean
  ): Promise<void> {
    const form = this.page.locator("nb-card", { hasText: "Inline form" });
    // fill name & email input field
    await form.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await form.getByRole("textbox", { name: "Email" }).fill(email);
    // check or uncheck remember me checkbox
    if (rememberMe) {
      await form.getByRole("checkbox").check({ force: true });
    }
    // press submit button
    await form.getByRole("button").click();
  }
}
