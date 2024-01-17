import { Page, expect } from "@playwright/test";
import { HelperBasePage } from "./helper-base-page";

export class DatePickerPage extends HelperBasePage {
  public async selectDateFromToday(daysToBeAdded: number): Promise<void> {
    const dateInputField = this.page.getByPlaceholder("Form Picker");
    await dateInputField.click();
    // select date
    const expectedDate = await this.selectDate(daysToBeAdded);
    // check the date
    const day = await dateInputField.inputValue();
    await expect(dateInputField).toHaveValue(expectedDate);
  }

  public async selectDateRangeFromToday(
    startDaysToBeAdded: number,
    endDaysToBeAdded: number
  ): Promise<void> {
    const dateInputField = this.page.getByPlaceholder("Range Picker");
    await dateInputField.click();
    // select date
    const expectedStartDate = await this.selectDate(startDaysToBeAdded);
    const expectedEndDate = await this.selectDate(endDaysToBeAdded);
    const expectedDateRange = `${expectedStartDate} - ${expectedEndDate}`;

    // check the date
    const day = await dateInputField.inputValue();
    await expect(dateInputField).toHaveValue(expectedDateRange);
  }

  private async selectDate(todayPlusDays: number): Promise<string> {
    // get future date
    let date = new Date();
    date.setDate(date.getDate() + todayPlusDays);
    const dayOfMonth = date.getDate().toString();
    // get day cell in date picker
    const dayCell = this.page
      .locator(".day-cell.ng-star-inserted")
      .getByText(dayOfMonth, { exact: true });
    await dayCell.click();
    const expectedDate = date.toLocaleDateString("En-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });
    return expectedDate;
  }
}
