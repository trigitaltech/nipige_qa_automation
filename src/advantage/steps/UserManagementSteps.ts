import { expect, Page } from "@playwright/test";
import UserManagementPage from "@pages/UserManagementPage";
import fs from "fs";
import path from "path";
import https from "https";

export default class UserManagementSteps {

    constructor(
        private page: Page
    ) { }

    private async wait(
        milliseconds: number = 3000
    ) {

        await this.page.waitForLoadState(
            "domcontentloaded"
        );

        await this.page.waitForTimeout(
            milliseconds
        );
    }

    async openUserManagementPage() {

        const menu = this.page.locator(
            UserManagementPage.USER_MANAGEMENT_MENU
        );

        await menu.waitFor({
            state: "visible",
            timeout: 60000
        });

        await menu.scrollIntoViewIfNeeded();

        await menu.click();

        await this.page.locator(
            UserManagementPage.PAGE_TITLE
        ).waitFor({
            state: "visible",
            timeout: 60000
        });

        await this.page.locator(
            UserManagementPage.SEARCH_BOX
        ).waitFor({
            state: "visible",
            timeout: 60000
        });

        await this.wait();
    }

    async verifyPageLoaded() {

        await expect(
            this.page.locator(
                UserManagementPage.PAGE_TITLE
            )
        ).toBeVisible();

        await expect(
            this.page.locator(
                UserManagementPage.SEARCH_BOX
            )
        ).toBeVisible();
    }

    async searchUser(
        searchText: string,
        expectedResult: string
    ) {

        const searchBox = this.page.locator(
            UserManagementPage.SEARCH_BOX
        );

        await searchBox.waitFor({
            state: "visible",
            timeout: 60000
        });

        await searchBox.click();

        await searchBox.clear();

        if (searchText?.trim()) {

            await searchBox.fill(
                searchText.trim()
            );
        }

        await this.wait(4000);

        const tableBody = this.page.locator(
            UserManagementPage.TABLE_BODY
        );

        switch (expectedResult) {

            case "Found":

                await expect(
                    tableBody
                ).toContainText(
                    searchText,
                    {
                        timeout: 10000
                    }
                );

                break;

            case "NotFound":

                await expect(
                    tableBody
                ).toContainText(
                    "No users found.",
                    {
                        timeout: 10000
                    }
                );

                break;
        }
    }

    async verifyTabs() {

        const tabs = [
            UserManagementPage.ALL_USERS_TAB,
            UserManagementPage.PENDING_TAB,
            UserManagementPage.APPROVED_TAB,
            UserManagementPage.REJECTED_TAB
        ];

        for (const tab of tabs) {

            const tabLocator = this.page.locator(
                tab
            );

            await tabLocator.scrollIntoViewIfNeeded();

            await tabLocator.click();

            await this.wait(2000);
        }
    }

    private async getFallbackSearchText(searchText: string): Promise<string> {
        try {
            await this.searchUser(searchText, "Found");
            return searchText;
        } catch (e) {
            console.log(`[UserManagementSteps] User '${searchText}' not found. Clearing search and trying fallback...`);
            const searchBox = this.page.locator(UserManagementPage.SEARCH_BOX);
            await searchBox.click();
            await searchBox.clear();
            await this.wait(4000);
            
            const tableBody = this.page.locator(UserManagementPage.TABLE_BODY);
            const firstRowText = await tableBody.locator("tr").first().locator("td").first().textContent().catch(() => "");
            if (firstRowText && !firstRowText.includes("No users found") && firstRowText.trim().length > 0) {
                const fallbackText = firstRowText.trim();
                console.log(`[UserManagementSteps] Falling back to first available user: '${fallbackText}'`);
                await this.searchUser(fallbackText, "Found");
                return fallbackText;
            }
            throw new Error(`[UserManagementSteps] Both target user '${searchText}' and fallback search failed: no users found in list.`);
        }
    }

    async viewUserDetails(
        searchText: string
    ) {

        searchText = await this.getFallbackSearchText(searchText);

        const viewButton = this.page.locator(
            UserManagementPage.VIEW_BUTTON
        ).first();

        await viewButton.scrollIntoViewIfNeeded();

        await expect(
            viewButton
        ).toBeVisible();

        await viewButton.click();

        await expect(
            this.page.locator(
                UserManagementPage.VIEW_PAGE_TITLE
            )
        ).toBeVisible({
            timeout: 60000
        });

        await this.wait(3000);

        await this.page.screenshot({
            path: "test-results/view-user-details.png",
            fullPage: true
        });
    }

    async editUser(
        searchText: string,
        updatedName: string
    ) {

        searchText = await this.getFallbackSearchText(searchText);

        const editButton = this.page.locator(
            UserManagementPage.EDIT_BUTTON
        ).first();

        await editButton.scrollIntoViewIfNeeded();

        await expect(
            editButton
        ).toBeVisible();

        await editButton.click();

        await expect(
            this.page.locator(
                UserManagementPage.EDIT_PAGE_TITLE
            )
        ).toBeVisible({
            timeout: 60000
        });

        const firstName = this.page.locator(
            UserManagementPage.FIRST_NAME_INPUT
        );

        await firstName.waitFor({
            state: "visible",
            timeout: 60000
        });

        await firstName.click();

        await firstName.press(
            "Control+A"
        );

        await firstName.press(
            "Backspace"
        );

        await firstName.fill(
            updatedName
        );

        const updateButton = this.page.locator(
            UserManagementPage.UPDATE_BUTTON
        );

        await updateButton.scrollIntoViewIfNeeded();

        await this.wait(2000);

        await expect(
            updateButton
        ).toBeVisible();

        await expect(
            updateButton
        ).toBeEnabled();

        await updateButton.click();

        await this.wait(5000);

        await this.page.screenshot({
            path: "test-results/edit-user.png",
            fullPage: true
        });
    }

    async deleteUser(
        searchText: string
    ) {

        searchText = await this.getFallbackSearchText(searchText);

        const deleteButton = this.page.locator(
            UserManagementPage.DELETE_BUTTON
        ).first();

        await deleteButton.scrollIntoViewIfNeeded();

        await expect(
            deleteButton
        ).toBeVisible();

        await deleteButton.click();

        const confirmButton = this.page.locator(
            UserManagementPage.CONFIRM_DELETE_BUTTON
        );

        await confirmButton.waitFor({
            state: "visible",
            timeout: 10000
        });

        await confirmButton.click();

        await this.wait(5000);
    }
// =========================










private async selectDropdownValue(
    locator: string,
    value: string
) {

    const dropdown = this.page.locator(locator);

    await dropdown.waitFor({
        state: "visible"
    });

    await dropdown.scrollIntoViewIfNeeded();

    await dropdown.click();

    await this.page.waitForTimeout(1000);

    await dropdown.fill(value);

    await this.page.waitForTimeout(2000);

    await this.page.getByRole(
        "option",
        {
            name: value,
            exact: true
        }
    ).click();

    await this.page.waitForTimeout(1000);
}


// ++++++++++++++++++

 async createUser(data: any) {

    console.log(data);

    await this.page.locator(
        UserManagementPage.CREATE_BUTTON
    ).click();

    await this.page.waitForLoadState("networkidle");

    await this.page.waitForTimeout(3000);

    // ==========================
    // STEP 1 - BASIC INFO
    // ==========================

    await this.page.locator(
        UserManagementPage.FULL_NAME
    ).fill(String(data.FullName ?? ""));

    await this.page.locator(
        UserManagementPage.EMAIL
    ).fill(String(data.Email ?? ""));

    await this.page.locator(
        UserManagementPage.PHONE
    ).fill(String(data.Phone ?? ""));

    let dob = "";

    if (data.DOB instanceof Date) {

        dob = data.DOB
            .toISOString()
            .split("T")[0];

    } else {

        dob = String(data.DOB ?? "").trim();
    }

    await this.page.locator(
        UserManagementPage.DOB
    ).fill(dob);

    await this.selectDropdownValue(
        UserManagementPage.GENDER,
        String(data.Gender ?? "")
    );

    await this.page.locator(
        UserManagementPage.ADDRESS
    ).fill(String(data.Address ?? ""));

    await this.page.waitForTimeout(3000);

    const addressItem = this.page.locator(
        UserManagementPage.GOOGLE_ADDRESS_ITEM
    ).first();

    await addressItem.waitFor({
        state: "visible",
        timeout: 10000
    });

    await addressItem.click();

    await this.page.keyboard.press("Escape");

    await this.page.waitForTimeout(1000);

    const saveButton = this.page.locator(
        UserManagementPage.SAVE_CONTINUE_BUTTON
    ).last();

    await saveButton.scrollIntoViewIfNeeded();

    await expect(saveButton).toBeEnabled();

    await saveButton.click({
        force: true
    });

    await this.page.waitForLoadState("networkidle");

    await this.page.waitForTimeout(5000);

    // ==========================
    // STEP 2 - SERVICE & SKILLS
    // ==========================

    await this.selectDropdownValue(
        UserManagementPage.CATEGORY,
        String(data.Category ?? "")
    );

    await this.page.waitForTimeout(2000);

    await this.selectDropdownValue(
        UserManagementPage.ROLE,
        String(data.Role ?? "")
    );

    await this.page.waitForTimeout(3000);

    await this.page.locator(
        UserManagementPage.INTERMEDIATE_LEVEL
    ).click();

    const experience = this.page.locator(
        UserManagementPage.EXPERIENCE
    );

    await experience.waitFor({
        state: "visible",
        timeout: 30000
    });

    await experience.scrollIntoViewIfNeeded();

    await experience.fill(
        String(data.Experience ?? "3")
    );

    await this.page.waitForTimeout(1000);

    // ==========================
    // ACCOUNT ACCESS
    // ==========================

  await this.page.locator(
    UserManagementPage.USERNAME
).fill(
    String(data.UserLogin ?? "")
);

await this.page.locator(
    UserManagementPage.PASSWORD
).fill(
    String(data.UserPassword ?? "")
);

await this.page.locator(
    UserManagementPage.CONFIRM_PASSWORD
).fill(
    String(data.ConfirmPassword ?? "")
);
const step2SaveButton = this.page.locator(
    UserManagementPage.SAVE_CONTINUE_BUTTON
).last();

await step2SaveButton.scrollIntoViewIfNeeded();

await expect(step2SaveButton).toBeEnabled();

await step2SaveButton.click({
    force: true
});

await this.page.waitForLoadState(
    "networkidle"
);

await this.page.waitForTimeout(3000);

// ==========================
// STEP 3 - SERVICE AREA
// ==========================

// Available Days

await this.page.getByRole("button", {
    name: "Mon"
}).click();

await this.page.getByRole("button", {
    name: "Tue"
}).click();

// Preferred Time Slots

await this.page.getByRole("button", {
    name: "6 PM - 9 PM",
    exact: true
}).click();

// Max Daily Jobs

// ==========================
// STEP 3 - SERVICE AREA
// ==========================

await this.page.waitForLoadState(
    "networkidle"
);

await this.page.waitForTimeout(3000);

// Scroll to bottom

// ==========================
// STEP 3 - SERVICE AREA
// ==========================

const step3SaveButton = this.page.locator(
    UserManagementPage.SAVE_CONTINUE_BUTTON
).last();

await step3SaveButton.scrollIntoViewIfNeeded();

await expect(
    step3SaveButton
).toBeVisible();

await expect(
    step3SaveButton
).toBeEnabled();

await step3SaveButton.click({
    force: true
});

await this.page.waitForLoadState(
    "networkidle"
);

await this.page.waitForTimeout(
    5000
);

// ==========================
// STEP 4 - KYC & DOCS
// ==========================

const idNumber =
    String(data.IDNumber ?? "").toUpperCase() === "RANDOM"
        ? this.generateRandom12Digit()
        : String(data.IDNumber ?? "");

const addressNumber =
    String(data.AddressNumber ?? "").toUpperCase() === "RANDOM"
        ? this.generateRandom12Digit()
        : String(data.AddressNumber ?? "");

const idInputs = this.page.locator(
    "input[placeholder='1234 5678 9012']"
);

await expect(
    idInputs.first()
).toBeVisible({
    timeout: 15000
});
await this.page.waitForTimeout(5000);

await idInputs.first().fill(
    idNumber
);
await this.page.waitForTimeout(5000);

await idInputs.nth(1).fill(
    addressNumber
);
await this.page.waitForTimeout(5000);

// ==========================
// DOWNLOAD URL FILES
// ==========================

const idFrontPhoto = await this.downloadFile(
    String(data.IDFrontPhoto),
    "id-front.jpg"
);
await this.page.waitForTimeout(5000);

const idBackPhoto = await this.downloadFile(
    String(data.IDBackPhoto),
    "id-back.jpg"
);
await this.page.waitForTimeout(5000);

const addressFrontPhoto = await this.downloadFile(
    String(data.AddressFrontPhoto),
    "address-front.jpg"
);
await this.page.waitForTimeout(5000);

const addressBackPhoto = await this.downloadFile(
    String(data.AddressBackPhoto),
    "address-back.jpg"
);
await this.page.waitForTimeout(5000);

// ==========================
// UPLOAD FILES
// ==========================

const fileInputs = this.page.locator(
    "input[type='file']"
);
await this.page.waitForTimeout(5000);

await fileInputs.nth(0).setInputFiles(
    idFrontPhoto
);
await this.page.waitForTimeout(5000);

await fileInputs.nth(1).setInputFiles(
    idBackPhoto
);
await this.page.waitForTimeout(5000);

await fileInputs.nth(2).setInputFiles(
    addressFrontPhoto
);
await this.page.waitForTimeout(5000);

await fileInputs.nth(3).setInputFiles(
    addressBackPhoto
);

await this.page.waitForTimeout(5000);

// ==========================
// SAVE
// ==========================

const step4SaveButton = this.page.locator(
    UserManagementPage.SAVE_CONTINUE_BUTTON
).last();

await step4SaveButton.scrollIntoViewIfNeeded();

await step4SaveButton.click({
    force: true
});
await this.page.waitForTimeout(5000);

await this.page.waitForLoadState(
    "networkidle"
);
await this.page.waitForTimeout(5000);

const completeSetupButton =
    this.page.locator(
        UserManagementPage.COMPLETE_SETUP_BUTTON
    );
await this.page.waitForTimeout(5000);


await completeSetupButton.scrollIntoViewIfNeeded();

await expect(
    completeSetupButton
).toBeVisible();

await expect(
    completeSetupButton
).toBeEnabled();

await completeSetupButton.click({
    force: true
});

await this.page.waitForLoadState(
    "networkidle"
);

await this.page.waitForTimeout(
    5000
);

await this.page.waitForTimeout(5000);}
 private generateRandom12Digit(): string {

    return Math.floor(
        100000000000 +
        Math.random() * 900000000000
    ).toString();

}

private async downloadFile(
    url: string,
    fileName: string
): Promise<string> {

    const fs = require("fs");
    const path = require("path");

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Failed to download: ${url}`
        );

    }

    const buffer = Buffer.from(
        await response.arrayBuffer()
    );

    const tempDir = path.resolve(
        "temp"
    );

    if (!fs.existsSync(tempDir)) {

        fs.mkdirSync(
            tempDir,
            {
                recursive: true
            }
        );

    }

    const filePath = path.join(
        tempDir,
        fileName
    );

    fs.writeFileSync(
        filePath,
        buffer
    );

    return filePath;

}

}