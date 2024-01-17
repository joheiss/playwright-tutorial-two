import { Page } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { FormLayoutsPage } from "./form-layouts-page";
import { DatePickerPage } from "./date-picker-page";

export class PageManager {
  private readonly _navigationPage: NavigationPage;
  private readonly _formLayoutsPage: FormLayoutsPage;
  private readonly _datePickerPage: DatePickerPage;

  constructor(private _page: Page) {
    this._navigationPage = new NavigationPage(_page);
    this._formLayoutsPage = new FormLayoutsPage(_page);
    this._datePickerPage = new DatePickerPage(_page);
  }

  get navigationPage(): NavigationPage {
    return this._navigationPage;
  }

  get formLayoutsPage(): FormLayoutsPage {
    return this._formLayoutsPage;
  }

  get datePickerPage(): DatePickerPage {
    return this._datePickerPage;
  }
}
