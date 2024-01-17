import { Locator, Page } from "@playwright/test";
import { HelperBasePage } from "./helper-base-page";

export class NavigationPage extends HelperBasePage {

  public async gotoFormLayoutsPage(): Promise<void> {
    await this.gotoPage("Forms", "Form Layouts");
  }

  public async gotoDatePickerPage(): Promise<void> {
    await this.gotoPage("Forms", "Datepicker");
  }

  public async gotoSmartTablePage(): Promise<void> {
    await this.gotoPage("Tables & Data", "Smart Table");
  }

  public async gotoToastrPage(): Promise<void> {
    await this.gotoPage("Modal & Overlays", "Toastr");
  }

  public async gotoTooltipPage(): Promise<void> {
    await this.gotoPage("Modal & Overlays", "Tooltip");
  }

  private async gotoPage(...items: string[]): Promise<void> {
    // select top level menu item - if not already selected
    await this.selectGroupMenuItem(items[0]);
    // select sub level items
    for (let i = 1; i < items.length; i++) {
      await this.page.getByText(items[i]).click();
    }
  }

  private async selectGroupMenuItem(groupItemTitle: string): Promise<void> {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const isExpanded = await groupMenuItem.getAttribute("aria-expanded");
    if (isExpanded === "false") {
      await groupMenuItem.click();
    }
  }
}
