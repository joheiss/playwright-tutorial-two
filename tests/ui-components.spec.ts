import { test, expect, Locator } from "@playwright/test";

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

    gridForm = page.locator("nb-card", { hasText: "Using the Grid" });
  });

  test("Input fields", async ({ page }) => {
    const gridEmailInputField = gridForm.getByRole("textbox", {
      name: "Email",
    });
    await gridEmailInputField.fill("test@testing.com");
    const text = await gridEmailInputField.inputValue();
    expect(text).toEqual("test@testing.com");
    await gridEmailInputField.clear();
    // simulate the key strokes
    await gridEmailInputField.pressSequentially("test@testing.company");
    await gridEmailInputField.clear();
    // type slowly
    await gridEmailInputField.pressSequentially("test@testing-is-good.com", {
      delay: 300,
    });
    // locator assertions
    await expect(gridEmailInputField).toHaveValue("test@testing-is-good.com");
  });

  test("Radiobuttons", async ({ page }) => {
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

  test("Checkboxes", async ({ page }) => {
    const checkbox = page.getByRole("checkbox", { name: "Hide on click" });
    // CLICK toggles the checkbox
    await checkbox.click({ force: true });
    // CHECK checks the checkbox - if already checked it's not unchecked!
    await checkbox.check({ force: true });
    // UNCHECK a checkbox
    const checkbox3 = page.getByRole("checkbox", {
      name: "Show toast with icon",
    });
    await checkbox3.uncheck({ force: true });

    // loop thru all checkboxes
    const checkboxes = page.getByRole("checkbox");
    for (const cb of await checkboxes.all()) {
      await cb.click({ force: true });
    }
    await expect(
      page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    ).toBeChecked();
  });
});

test.describe("Lists and Dropdowns", () => {
  test("Theme selection", async ({ page }) => {
    const ddMenu = page.locator("ngx-header nb-select");
    await ddMenu.click();
    // role = 'list' can be used if list has an UL tag
    // const list = page.getByRole('list');
    // role = 'listitem' can be used if item has LI tag
    // const listItem = page.getByRole('listitem');
    // const listItems = page.getByRole('list').locator('nb-option');
    const listItems = page.locator("nb-option-list nb-option");
    await expect(listItems).toHaveText([
      "Light",
      "Dark",
      "Cosmic",
      "Corporate",
    ]);
    // select Cosmic
    await listItems.filter({ hasText: "Cosmic" }).click();
    // check background color
    const header = page.locator("nb-layout-header");
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

    // test all colors
    const themes: { [key: string]: string } = {
      Light: "rgb(255, 255, 255)",
      Dark: "rgb(34, 43, 69)",
      Cosmic: "rgb(50, 50, 89)",
      Corporate: "rgb(255, 255, 255)",
    };
    await ddMenu.click();
    for (const color in themes) {
      console.log("Color: ", color);
      await listItems.filter({ hasText: color }).click();
      await expect(header).toHaveCSS("background-color", themes[color]);
      if (color != "Corporate") {
        await ddMenu.click();
      }
    }
  });
});

test.describe("Tooltips", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Tooltip").click();
  });

  test("Tooltip", async ({ page }) => {
    const tooltipCard = page.locator("nb-tooltip", {
      hasText: "Tooltip Placements",
    });
    const topButton = page.getByRole("button", { name: "Top" });
    await topButton.hover();
    // use tooltip role - only if element is a tooltip element
    // const tooltipText = await page.getByRole("tooltip").textContent();
    const tooltipText = await page.locator("nb-tooltip").textContent();
    expect(tooltipText).toEqual("This is a tooltip");
  });
});

test.describe("Dialog Boxes", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();
  });

  test("Custom dialog box - belonging to the app", async ({ page }) => {});

  test("Standard dialog box - belonging to the browser", async ({ page }) => {
    // add listener for dialog
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toEqual("Are you sure you want to delete?");
      await dialog.accept();
    });
    // get table row
    const tableRow = page
      .getByRole("table")
      .locator("tr", { hasText: "mdo@gmail.com" });
    // get trash button for row and click it
    const trashButton = tableRow.locator(".nb-trash");
    await trashButton.click();
    // validate that row has been deleted
    await expect(page.locator("table tr").first()).not.toHaveText(
      "mdo@gmail.com"
    );
  });
});

test.describe("Tables", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();
  });

  test("Specific table row contents", async ({ page }) => {
    // get table row
    const tableRow = page.getByRole("row", { name: "twitter@outlook.com" });
    const editButton = tableRow.locator(".nb-edit");
    await editButton.click();
    // get editable Age input field
    const ageInputField = page.locator("input-editor").getByPlaceholder("Age");
    // clear input field and fill it with updated value
    await ageInputField.clear();
    await ageInputField.fill("61");
    // click the check button
    const checkButton = page.locator(".nb-checkmark");
    await checkButton.click();
  });

  test("Specific table column contents", async ({ page }) => {
    // navigate to 2nd page
    const paginatorButton2 = page
      .locator(".ng2-smart-pagination-nav")
      .getByText("2");
    await paginatorButton2.click();
    // get row with ID = "11"
    const tableRow = page
      .getByRole("row", { name: "11" })
      .filter({ has: page.locator("td").nth(1).getByText("11") });
    await tableRow.locator(".nb-edit").click();
    const emailInputField = page
      .locator("input-editor")
      .getByPlaceholder("E-mail");
    await emailInputField.clear();
    await emailInputField.fill("test@testing.co.uk");
    // click the check button
    const checkButton = page.locator(".nb-checkmark");
    await checkButton.click();
    await expect(tableRow.locator("td").nth(5)).toHaveText(
      "test@testing.co.uk"
    );
  });

  test("Multiple table columns - filtering", async ({ page }) => {
    const ages = ["20", "30", "40", "200"];
    for (const age of ages) {
      // get filter field for age
      const ageFilterField = page
        .locator("input-filter")
        .getByPlaceholder("Age");
      // clear filter and then filter by currently given age
      await ageFilterField.clear();
      await ageFilterField.fill(age);
      // a short wait is needed to let the filtering happen
      await page.waitForTimeout(300);
      // get filtered rows
      const rows = page.locator("tbody tr");
      for (const row of await rows.all()) {
        const cellValue = await row.locator("td").last().textContent();
        age === "200"
          ? expect(cellValue).toContain("No data found")
          : expect(cellValue).toEqual(age);
      }
    }
  });
});

test.describe("Date Picker ...", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();
  });

  test("Select the date picker", async ({ page }) => {
    const dateInputField = page.getByPlaceholder("Form Picker");
    await dateInputField.click();
    // get 28th day cell of current month in date picker
    const day28 = page
      .locator('[class="day-cell ng-star-inserted"]')
      .getByText("28", { exact: true });
    await day28.click();
    const day = await dateInputField.inputValue();
    expect(day).toContain("28");
    // await expect(dateInputField).toHaveValue("Jan 28, 2024");
  });

  test("Select the date dynamically from date picker", async ({ page }) => {
    const dateInputField = page.getByPlaceholder("Form Picker");
    await dateInputField.click();

    // get future date
    let date = new Date();
    date.setDate(date.getDate() + 1);
    const dayOfMonth = date.getDate().toString();
    // get tomorrow's day cell in date picker
    const dayCell = page
      .locator('[class="day-cell ng-star-inserted"]')
      .getByText(dayOfMonth, { exact: true });
    await dayCell.click();
    const day = await dateInputField.inputValue();
    const expectedDate = date.toLocaleDateString("En-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });
    await expect(dateInputField).toHaveValue(expectedDate);
  });
});

test.describe("Sliders", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("IoT Dashboard").click();
  });

  test("Move slider by changing the coordinates programmatically", async ({
    page,
  }) => {
    const slider = page.locator(
      '[tabtitle="Temperature"] ngx-temperature-dragger circle'
    );
    // set slider to maximum - using cx and cy coordinates
    await slider.evaluate((gauge) => {
      gauge.setAttribute("cx", "232.630");
      gauge.setAttribute("cy", "232.630");
    });
    // ... and click
    await slider.click();
  });

  test("Move slider by simulating the mouse movements", async ({ page }) => {
    const tempBox = page.locator(
      '[tabtitle="Temperature"] ngx-temperature-dragger'
    );
    // make sure the temperature box is fully visible
    await tempBox.scrollIntoViewIfNeeded();
    // get bounding box and center mouse in the middle
    const boundingBox = await tempBox.boundingBox();
    const centerX = boundingBox.x + boundingBox.width / 2;
    const centerY = boundingBox.y + boundingBox.height / 2;
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 100, centerY);
    await page.mouse.move(centerX + 100, centerY + 100);
    await page.mouse.up();
    await expect(tempBox).toContainText("30");
  });
});
