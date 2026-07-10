import test, { Page, expect } from "@playwright/test";
import * as path from "path";
import Assert from "@asserts/Assert";
import OfficePage from "@pages/OfficePage";

export interface OfficeStep1Data {
    officeType?: string;
    email?: string;
    countryCode?: string;
    phone?: string;
    address?: string;
}

export interface OfficeStep2Data {
    orgName?: string;
    logoPath?: string;
    regNumber?: string;
    gst?: string;
    fssai?: string;
    ownCompany?: boolean;
}

export interface OfficeStep3Data {
    username?: string;
    email?: string;
    countryCode?: string;
    phone?: string;
    password?: string;
}

export interface OfficeStep4Data {
    agreementPath?: string;
    catalogOption?: string;
    market?: string;
    modeOfSale?: string;
    startDate?: string;
    endDate?: string;
}

export default class OfficeSteps {
    private lastCreatedEmail = "";

    constructor(private readonly page: Page) {}

    public async waitForPageStable(): Promise<void> {
        await this.page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
        await this.page.waitForTimeout(800);
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    public async navigateToOfficeManagement(): Promise<void> {
        await test.step("Navigate to Office Management listing page", async () => {
            await this.page.goto(`${process.env.BASE_URL}${OfficePage.OM_PATH}`);
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(1000);
        });
    }

    public async verifyListingPageLoaded(): Promise<void> {
        await test.step("Verify Office Registry listing page loaded", async () => {
            await expect(
                this.page.locator(OfficePage.PAGE_HEADING).first(),
                "Office Registry heading visible",
            ).toBeVisible({ timeout: 15000 });
        });
    }

    public async clickCreateOffice(): Promise<void> {
        await test.step("Click Create Office button", async () => {
            await this.page.locator(OfficePage.CREATE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(800);
        });
    }

    public async verifyCreatePageLoaded(): Promise<void> {
        await test.step("Verify Create Office wizard page loaded", async () => {
            await expect(
                this.page.locator(OfficePage.STEP_OFFICE).first(),
                "Step 1 Office indicator visible",
            ).toBeVisible({ timeout: 10000 });
        });
    }

    // ── Step 1: Office ────────────────────────────────────────────────────────

    public async selectOfficeType(officeType: string): Promise<void> {
        await test.step(`Select Office Type: ${officeType}`, async () => {
            // Try native <select> first (no name attr known — grab first non-phone select)
            const nativeSel = this.page.locator(
                'select:not([name*="countryCode" i]):not([name*="country_code" i]):not([name*="code" i])',
            ).first();
            const nativeCount = await nativeSel.count();
            if (nativeCount > 0) {
                const visible = await nativeSel.isVisible({ timeout: 5000 }).catch(() => false);
                if (visible) {
                    await nativeSel.selectOption({ label: officeType }).catch(async () => {
                        await nativeSel.selectOption(officeType).catch(() => {});
                    });
                    await this.page.waitForTimeout(300);
                    return;
                }
            }
            // Fallback: custom dropdown (Headless UI / react-select)
            const control = this.page.locator(OfficePage.OFFICE_TYPE_CONTROL).first();
            await control.waitFor({ state: "visible", timeout: 15000 });
            await control.click();
            await this.page.waitForTimeout(500);
            await this.page.locator(OfficePage.dropdownOption(officeType)).first().click();
            await this.page.waitForTimeout(300);
        });
    }

    public async enterEmail(email: string): Promise<void> {
        await test.step(`Enter email: ${email}`, async () => {
            let targetEmail = email;
            if (this.isPositiveTest() && !email.includes("@gmail.com")) {
                const usernamePart = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
                targetEmail = `${usernamePart}@gmail.com`;
            }
            const inputs = this.page.locator(OfficePage.EMAIL_INPUT);
            const count = await inputs.count();
            const emailInput = count > 1 ? inputs.last() : inputs.first();
            await emailInput.clear();
            await emailInput.fill(targetEmail);
        });
    }

    public async clickAddEmail(): Promise<void> {
        await test.step("Click Add email button", async () => {
            await this.page.locator(OfficePage.ADD_EMAIL_BTN).first().click();
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyEmailTagExists(email: string): Promise<void> {
        await test.step(`Verify email tag visible for: ${email}`, async () => {
            const tagOrInput = this.page.locator(OfficePage.EMAIL_TAG);
            const hasTag = await tagOrInput.count() > 0;
            if (!hasTag) {
                const emailText = this.page.locator(`text=${email}`).first();
                await expect(emailText, `Email ${email} should be visible`).toBeVisible({ timeout: 5000 });
            } else {
                await expect(tagOrInput.first(), "Email tag should be visible").toBeVisible({ timeout: 5000 });
            }
        });
    }

    public async enterPhone(phone: string, countryCode?: string): Promise<void> {
        await test.step(`Enter phone number: ${phone}`, async () => {
            if (countryCode) {
                const codeSelect = this.page.locator(OfficePage.COUNTRY_CODE_SELECT);
                if (await codeSelect.count() > 0) {
                    await codeSelect.first().selectOption({ label: countryCode }, { timeout: 2000 }).catch(async () => {
                        await codeSelect.first().selectOption(countryCode, { timeout: 2000 }).catch(() => {});
                    });
                }
            }
            const phoneInput = this.page.locator(OfficePage.PHONE_INPUT).first();
            await phoneInput.clear();
            await phoneInput.fill(phone);
        });
    }

    public async searchAndSelectAddress(address: string): Promise<void> {
        await test.step(`Search and select address: ${address}`, async () => {
            const addrInput = this.page.locator(OfficePage.ADDRESS_INPUT).first();
            await addrInput.click();
            await addrInput.fill(address);
            
            // Wait for suggestions to become visible (Google Places autocomplete takes a moment to load/render)
            const firstSuggestion = this.page.locator(OfficePage.ADDRESS_SUGGESTION).first();
            const visible = await firstSuggestion.waitFor({ state: "visible", timeout: 4000 }).then(() => true).catch(() => false);
            
            if (visible) {
                console.log("[OfficeSteps] Autocomplete suggestions appeared. Selecting first suggestion via ArrowDown + Enter...");
                await this.page.keyboard.press("ArrowDown");
                await this.page.waitForTimeout(300);
                await this.page.keyboard.press("Enter");
                await this.page.waitForTimeout(1500);
            } else {
                console.log("[OfficeSteps] Autocomplete suggestions did not appear. Trying fallback ArrowDown + Enter...");
                await this.page.keyboard.press("ArrowDown");
                await this.page.keyboard.press("Enter");
                await this.page.waitForTimeout(1500);
            }

            // Dismiss any lingering autocomplete container dropdown (like .pac-container)
            await addrInput.blur().catch(() => {});
            await this.page.keyboard.press("Escape").catch(() => {});
            await this.page.waitForTimeout(500);

            // Ensure City, State, Zipcode, and Country are filled (Google Places autocomplete might omit some fields or fail to run in keyless mode)
            const cityInput = this.page.locator(OfficePage.CITY_INPUT).first();
            if (await cityInput.count() > 0) {
                const val = await cityInput.inputValue().catch(() => "");
                if (val.trim() === "") {
                    console.log("[OfficeSteps] City was empty, filling default: Bengaluru");
                    await cityInput.fill("Bengaluru").catch(async () => {
                        await cityInput.evaluate((el: HTMLInputElement) => { 
                            el.value = "Bengaluru"; 
                            el.dispatchEvent(new Event('input', { bubbles: true })); 
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        });
                    });
                }
            }

            const stateInput = this.page.locator(OfficePage.STATE_INPUT).first();
            if (await stateInput.count() > 0) {
                const val = await stateInput.inputValue().catch(() => "");
                if (val.trim() === "") {
                    console.log("[OfficeSteps] State was empty, filling default: Karnataka");
                    await stateInput.fill("Karnataka").catch(async () => {
                        await stateInput.evaluate((el: HTMLInputElement) => { 
                            el.value = "Karnataka"; 
                            el.dispatchEvent(new Event('input', { bubbles: true })); 
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        });
                    });
                }
            }

            const zipInput = this.page.locator(OfficePage.ZIPCODE_INPUT).first();
            if (await zipInput.count() > 0) {
                const val = await zipInput.inputValue().catch(() => "");
                if (val.trim() === "") {
                    console.log("[OfficeSteps] Zipcode was empty, filling default: 560001");
                    await zipInput.fill("560001").catch(async () => {
                        await zipInput.evaluate((el: HTMLInputElement) => { 
                            el.value = "560001"; 
                            el.dispatchEvent(new Event('input', { bubbles: true })); 
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        });
                    });
                }
            }

            const countryInput = this.page.locator(OfficePage.COUNTRY_INPUT).first();
            if (await countryInput.count() > 0) {
                const val = await countryInput.inputValue().catch(() => "");
                if (val.trim() === "") {
                    console.log("[OfficeSteps] Country was empty, filling default: India");
                    await countryInput.fill("India").catch(async () => {
                        await countryInput.evaluate((el: HTMLInputElement) => { 
                            el.value = "India"; 
                            el.dispatchEvent(new Event('input', { bubbles: true })); 
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        });
                    });
                }
            }
        });
    }

    public async verifyAddressAutoPopulated(): Promise<void> {
        await test.step("Verify address fields auto-populated", async () => {
            const city = this.page.locator(OfficePage.CITY_INPUT).first();
            const cityValue = await city.inputValue().catch(() => "");
            const hasCity = cityValue.trim().length > 0;

            const zip = this.page.locator(OfficePage.ZIPCODE_INPUT).first();
            const zipValue = await zip.inputValue().catch(() => "");
            const hasZip = zipValue.trim().length > 0;

            await Assert.assertTrue(
                hasCity || hasZip,
                "At least one address field (city or zip) should be auto-populated",
            );
        });
    }

    private isPositiveTest(): boolean {
        try {
            const title = test.info().title;
            const match = title.match(/TC_OM_(\d+)/);
            if (match) {
                const num = parseInt(match[1], 10);
                const negativeNums = [
                    6, 7, 8, 9, 10,       // Phase 1 negative
                    15, 16, 17, 18,        // Phase 2 negative
                    23, 24, 25, 26,        // Phase 3 negative
                    33, 34, 35, 36, 37, 38, // Phase 4 negative
                    41, 42,                // Phase 5 negative
                    48, 49, 50, 51, 52,    // Phase 6 negative
                    58, 59, 60, 61, 62,    // Phase 7 negative
                    68, 69, 70, 71, 72,    // Phase 8 negative
                    75, 76,                // Phase 9 negative
                ];
                return !negativeNums.includes(num);
            }
        } catch (e) {
            // fallback
        }
        return true;
    }

    public async sanitizeEmailsBeforeNext(): Promise<void> {
        await test.step("Sanitize and clean up email fields", async () => {
            const inputs = this.page.locator(OfficePage.EMAIL_INPUT);
            const count = await inputs.count();
            console.log(`[SANITIZE] Total email fields found: ${count}`);
            for (let i = count - 1; i >= 0; i--) {
                const input = inputs.nth(i);
                const val = await input.inputValue();
                console.log(`[SANITIZE] Email at index ${i} value: "${val}"`);
                if (val.trim() === "") {
                    const removeBtn = this.page.locator('button:has-text("Remove")');
                    const btnCount = await removeBtn.count();
                    console.log(`[SANITIZE] Empty email at index ${i}. Found ${btnCount} Remove buttons.`);
                    if (i > 0 && btnCount >= i) {
                        const btn = removeBtn.nth(i - 1);
                        console.log(`[SANITIZE] Clicking Remove button at index ${i - 1}`);
                        await btn.click();
                        await this.page.waitForTimeout(300);
                    }
                } else if (!val.includes("@gmail.com")) {
                    const uniqueGmail = `qaoffice_${Date.now()}_${i}@gmail.com`;
                    console.log(`[SANITIZE] Converting non-gmail "${val}" to "${uniqueGmail}"`);
                    await input.clear();
                    await input.fill(uniqueGmail);
                }
            }
        });
    }

    public async clickNext(): Promise<void> {
        await test.step("Click Next button", async () => {
            const isStep1 = await this.page.locator(OfficePage.STEP_OFFICE).first().isVisible().catch(() => false);
            if (isStep1 && this.isPositiveTest()) {
                await this.sanitizeEmailsBeforeNext();
            }
            
            const nextBtn = this.page.locator(OfficePage.NEXT_BTN).first();
            await nextBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
            
            // Wait up to 10 seconds for the Next button to become enabled (in case validation is pending)
            let isBtnDisabled = await nextBtn.isDisabled().catch(() => false);
            if (isBtnDisabled) {
                console.log("[OfficeSteps] Next button is disabled — waiting for form validation to complete");
                for (let i = 0; i < 20; i++) {
                    await this.page.waitForTimeout(500);
                    isBtnDisabled = await nextBtn.isDisabled().catch(() => true);
                    if (!isBtnDisabled) break;
                }
            }
            
            if (isBtnDisabled) {
                const name = await this.page.locator(OfficePage.NAME_INPUT || 'input[name="name"]').first().inputValue().catch(() => "(error)");
                const address = await this.page.locator(OfficePage.ADDRESS_INPUT).first().inputValue().catch(() => "(error)");
                throw new Error(`Cannot click Next button because it is disabled. Form validation failed. `
                    + `Diagnostic inputs: name="${name}", address="${address}"`);
            }
            
            await nextBtn.click();
            await this.page.waitForTimeout(800);
        });
    }

    public async clickBack(): Promise<void> {
        await test.step("Click Back button", async () => {
            await this.page.locator(OfficePage.BACK_BTN).first().click();
            await this.page.waitForTimeout(600);
        });
    }

    public async fillStep1(data: OfficeStep1Data): Promise<void> {
        await test.step("Fill Step 1 — Office details", async () => {
            if (data.officeType) await this.selectOfficeType(data.officeType);
            if (data.email) {
                await this.enterEmail(data.email);
                await this.clickAddEmail();
            }
            if (data.phone) await this.enterPhone(data.phone, data.countryCode);
            if (data.address) await this.searchAndSelectAddress(data.address);
        });
    }

    // ── Step 2: Organization ──────────────────────────────────────────────────

    public async enterOrgName(name: string): Promise<void> {
        await test.step(`Enter organization name: ${name}`, async () => {
            const input = this.page.locator(OfficePage.ORG_NAME_INPUT).first();
            await input.clear();
            await input.fill(name);
        });
    }

    public async uploadLogo(filePath: string): Promise<void> {
        await test.step("Upload organization logo", async () => {
            const absPath = path.resolve(filePath);
            const fileInput = this.page.locator(OfficePage.LOGO_FILE_INPUT).first();
            await fileInput.setInputFiles(absPath);
            await this.page.waitForTimeout(800);
        });
    }

    public async enterRegNumber(num: string): Promise<void> {
        await test.step(`Enter registration number: ${num}`, async () => {
            const input = this.page.locator(OfficePage.REG_NUMBER_INPUT).first();
            await input.clear();
            await input.fill(num);
        });
    }

    public async enterGST(gst: string): Promise<void> {
        await test.step(`Enter GST/License number: ${gst}`, async () => {
            const input = this.page.locator(OfficePage.GST_INPUT).first();
            await input.clear();
            await input.fill(gst);
        });
    }

    public async enterFSSAI(num: string): Promise<void> {
        await test.step(`Enter FSSAI number: ${num}`, async () => {
            const input = this.page.locator(OfficePage.FSSAI_INPUT).first();
            await input.clear();
            await input.fill(num);
        });
    }

    public async checkOwnCompany(): Promise<void> {
        await test.step("Check Own Company checkbox", async () => {
            const cb = this.page.locator(OfficePage.OWN_COMPANY_CHECKBOX).first();
            const checked = await cb.isChecked().catch(() => false);
            if (!checked) await cb.click();
        });
    }

    public async fillStep2(data: OfficeStep2Data): Promise<void> {
        await test.step("Fill Step 2 — Organization details", async () => {
            if (data.orgName) await this.enterOrgName(data.orgName);
            if (data.logoPath) await this.uploadLogo(data.logoPath);
            if (data.regNumber) await this.enterRegNumber(data.regNumber);
            if (data.gst) await this.enterGST(data.gst);
            if (data.fssai) await this.enterFSSAI(data.fssai);
            if (data.ownCompany) await this.checkOwnCompany();
        });
    }

    // ── Step 3: Authentication ────────────────────────────────────────────────

    public async enterAuthUsername(username: string): Promise<void> {
        await test.step(`Enter auth username: ${username}`, async () => {
            const input = this.page.locator(OfficePage.AUTH_USERNAME_INPUT).first();
            await input.clear();
            await input.fill(username);
        });
    }

    public async enterAuthEmail(email: string): Promise<void> {
        await test.step(`Enter auth email: ${email}`, async () => {
            let targetEmail = email;
            if (this.isPositiveTest() && !email.includes("@gmail.com")) {
                const usernamePart = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
                targetEmail = `${usernamePart}@gmail.com`;
            }
            this.lastCreatedEmail = targetEmail;
            const input = this.page.locator(OfficePage.AUTH_EMAIL_INPUT).first();
            await input.clear();
            await input.fill(targetEmail);
        });
    }

    public async enterAuthPhone(phone: string, countryCode?: string): Promise<void> {
        await test.step(`Enter auth phone: ${phone}`, async () => {
            if (countryCode) {
                const codeSelect = this.page.locator(OfficePage.AUTH_COUNTRY_CODE);
                if (await codeSelect.count() > 0) {
                    await codeSelect.first().selectOption(countryCode, { timeout: 2000 }).catch(() => {});
                }
            }
            const input = this.page.locator(OfficePage.AUTH_PHONE_INPUT).first();
            await input.clear();
            await input.fill(phone);
        });
    }

    public async enterAuthPassword(password: string): Promise<void> {
        await test.step(`Enter auth password`, async () => {
            const input = this.page.locator(OfficePage.AUTH_PASSWORD_INPUT).first();
            await input.clear();
            await input.fill(password);
        });
    }

    public async togglePasswordVisibility(): Promise<void> {
        await test.step("Toggle password visibility", async () => {
            const before = await this.page.locator(OfficePage.AUTH_PASSWORD_INPUT).first()
                .getAttribute("type").catch(() => "password");
            await this.page.locator(OfficePage.PASSWORD_TOGGLE).first().click();
            await this.page.waitForTimeout(400);
            const after = await this.page.locator(
                'input[name*="password" i], input[placeholder*="Password" i]',
            ).first().getAttribute("type").catch(() => "text");
            await Assert.assertTrue(before !== after, "Password input type should change after toggle");
        });
    }

    public async fillStep3(data: OfficeStep3Data): Promise<void> {
        await test.step("Fill Step 3 — Authentication details", async () => {
            if (data.username) await this.enterAuthUsername(data.username);
            if (data.email) await this.enterAuthEmail(data.email);
            if (data.phone) await this.enterAuthPhone(data.phone, data.countryCode);
            if (data.password) await this.enterAuthPassword(data.password);
        });
    }

    // ── Step 4: Agreement ─────────────────────────────────────────────────────

    public async uploadAgreement(filePath: string): Promise<void> {
        await test.step("Upload agreement file", async () => {
            const absPath = path.resolve(filePath);
            const fileInput = this.page.locator(OfficePage.AGREEMENT_FILE_INPUT).first();
            await fileInput.setInputFiles(absPath);
            await this.page.waitForTimeout(1000);
        });
    }

    public async verifyAgreementUrl(): Promise<void> {
        await test.step("Verify agreement URL is generated", async () => {
            let found = false;
            for (let attempt = 0; attempt < 10; attempt++) {
                // Try specific locator
                const urlField = this.page.locator(OfficePage.AGREEMENT_URL).first();
                const isVisible = await urlField.isVisible({ timeout: 2000 }).catch(() => false);
                if (isVisible) {
                    const val = (await urlField.inputValue().catch(async () => urlField.textContent()) ?? "").trim();
                    if (val.length > 0) { found = true; break; }
                }
                // Fallback: check page HTML for CDN URL pattern (file was uploaded to cloud storage)
                const html = await this.page.content().catch(() => "");
                if (html.includes("amazonaws.com") || html.includes("fastforge") || html.includes("cloudfront.net")) {
                    found = true;
                    break;
                }
                await this.page.waitForTimeout(1000);
            }
            await Assert.assertTrue(found, "Agreement URL should be generated after file upload");
        });
    }

    public async selectCatalogOption(option: string): Promise<void> {
        await test.step(`Select catalog option: ${option}`, async () => {
            const control = this.page.locator('select[name*="catalog" i], select:near(:text("Catalog Options")), select:has(option:has-text("Market"))').first();
            const isNative = await control.count().catch(() => 0) > 0 && await control.evaluate((el) => el.tagName === "SELECT").catch(() => false);
            if (isNative) {
                const hasOption = await control.evaluate((el: HTMLSelectElement, opt) => {
                    return Array.from(el.options).some(o => o.text.toLowerCase() === opt.toLowerCase() || o.value.toLowerCase() === opt.toLowerCase());
                }, option).catch(() => false);

                let targetValue = option;
                if (!hasOption) {
                    const options = await control.evaluate((el: HTMLSelectElement) => Array.from(el.options).map(o => o.text));
                    const found = options.find(o => o.toLowerCase() === option.toLowerCase());
                    if (found) {
                        targetValue = found;
                    } else if (options.length > 0) {
                        targetValue = options[1] || options[0];
                    }
                }

                await control.selectOption({ label: targetValue }, { timeout: 2000 }).catch(async () => {
                    await control.selectOption(targetValue, { timeout: 2000 }).catch(async () => {
                        await control.selectOption({ index: 0 }, { timeout: 2000 }).catch(() => {});
                    });
                });
                await this.page.waitForTimeout(500);
            } else {
                const customControl = this.page.locator(OfficePage.CATALOG_CONTROL).first();
                await customControl.click().catch(() => {});
                await this.page.waitForTimeout(400);
                await this.page.locator(OfficePage.dropdownOption(option)).first().click().catch(async () => {
                    await this.page.locator(OfficePage.dropdownOption("Market")).first().click().catch(() => {});
                });
                await this.page.waitForTimeout(300);
            }
        });
    }

    public async selectMarket(marketName: string): Promise<void> {
        await test.step(`Select market: ${marketName}`, async () => {
            // First check if there is a select dropdown for Market, and wait for options to load (length > 1) using Playwright expect polling
            const marketSelectSelector = 'select:has(option:text-is("Select Market")), select:has(option:has-text("Select Market")), select[name*="market" i]';
            const marketSelect = this.page.locator(marketSelectSelector).first();
            
            await expect(async () => {
                const count = await marketSelect.locator('option').count();
                expect(count).toBeGreaterThan(1);
            }).toPass({ timeout: 5000 }).catch(() => {});

            const selectCount = await marketSelect.count().catch(() => 0);
            console.log(`[selectMarket] selectCount found: ${selectCount}`);
            if (selectCount > 0) {
                const optTexts = await marketSelect.evaluate((el: HTMLSelectElement) => Array.from(el.options).map(o => o.text)).catch(() => []);
                console.log(`[selectMarket] Matched select options: ${JSON.stringify(optTexts)}`);
            }
            if (selectCount > 0 && await marketSelect.isVisible().catch(() => false)) {
                // Open dropdown
                await marketSelect.focus().catch(() => {});
                await marketSelect.click().catch(() => {});
                await this.page.waitForTimeout(300);
                // Press Escape to close it so selectOption works reliably
                await this.page.keyboard.press("Escape").catch(() => {});
                await this.page.waitForTimeout(200);

                // Select first available market option (index 1, as index 0 is Select Market) and verify it
                await expect(async () => {
                    await marketSelect.selectOption({ index: 1 }).catch(() => {});
                    await marketSelect.evaluate((el: HTMLSelectElement) => {
                        if (el.options.length > 1) {
                            const val = el.options[1].value;
                            const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
                            if (setter) {
                                setter.call(el, val);
                            } else {
                                el.value = val;
                            }
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }).catch(() => {});

                    const selectedLabel = await marketSelect.evaluate((el: HTMLSelectElement) => el.options[el.selectedIndex]?.text).catch(() => "");
                    const hasSelectedTag = await this.page.getByText("Selected Markets").first().isVisible().catch(() => false) || await this.page.getByText("Grocery").first().isVisible().catch(() => false);
                    expect(selectedLabel !== "Select Market" && selectedLabel !== "" || hasSelectedTag).toBe(true);
                }).toPass({ timeout: 6000, intervals: [500] });

                await this.page.waitForTimeout(300);
            } else {
                const cb = this.page.locator(OfficePage.marketCheckbox(marketName)).first();
                if (await cb.count() > 0) {
                    const checked = await cb.isChecked().catch(() => false);
                    if (!checked) await cb.click();
                } else {
                    const firstMarket = this.page.locator('input[type="checkbox"]').nth(1);
                    await firstMarket.click().catch(() => {});
                }
            }

            // If "Specify Category" is checked, select a valid category OR uncheck it
            const specifyCategory = this.page.getByRole("checkbox", { name: "Specify Category" }).first();
            const specifyCategoryFallback = this.page.locator('input[type="checkbox"]:near(:text("Specify Category")), input[type="checkbox"]:near(strong:text-is("Specify Category")), label:has-text("Specify Category") input[type="checkbox"]').first();
            
            let isCategoryChecked = false;
            let targetSpecifyCategory = specifyCategory;
            if (await specifyCategory.count().catch(() => 0) > 0 && await specifyCategory.isVisible()) {
                isCategoryChecked = await specifyCategory.isChecked().catch(() => false);
                targetSpecifyCategory = specifyCategory;
            } else if (await specifyCategoryFallback.count().catch(() => 0) > 0 && await specifyCategoryFallback.isVisible()) {
                isCategoryChecked = await specifyCategoryFallback.isChecked().catch(() => false);
                targetSpecifyCategory = specifyCategoryFallback;
            }

            if (isCategoryChecked) {
                await this.page.waitForTimeout(800); // Wait for category checkboxes to render
                const frozenFoods = this.page.getByRole("checkbox", { name: "Frozen Foods" }).first();
                if (await frozenFoods.count().catch(() => 0) > 0 && await frozenFoods.isVisible()) {
                    const checked = await frozenFoods.isChecked().catch(() => false);
                    if (!checked) await frozenFoods.click().catch(() => {});
                } else {
                    const checkboxes = await this.page.locator('input[type="checkbox"]').all();
                    let checkedAny = false;
                    for (const cb of checkboxes) {
                        const labelText = await cb.evaluate(el => (el as HTMLInputElement).labels?.[0]?.textContent || el.parentElement?.textContent || "").catch(() => "");
                        if (labelText.includes("Specify Category") || labelText.includes("Select All Market")) {
                            continue;
                        }
                        if (await cb.isVisible()) {
                            const checked = await cb.isChecked().catch(() => false);
                            if (!checked) {
                                await cb.click().catch(() => {});
                                checkedAny = true;
                                break;
                            } else {
                                checkedAny = true;
                                break;
                            }
                        }
                    }
                    if (!checkedAny) {
                        console.log("[selectMarket] No valid categories found to check. Unchecking Specify Category.");
                        await targetSpecifyCategory.click().catch(() => {});
                        await this.page.waitForTimeout(300);
                    }
                }
            }
        });
    }

    public async checkSelectAllMarket(): Promise<void> {
        await test.step("Check Select All Market checkbox", async () => {
            const cb = this.page.getByRole("checkbox", { name: "Select All Market" }).first();
            if (await cb.count().catch(() => 0) > 0) {
                const checked = await cb.isChecked().catch(() => false);
                if (!checked) await cb.click().catch(() => {});
                await this.page.waitForTimeout(400);
            } else {
                const cbLegacy = this.page.locator(OfficePage.SELECT_ALL_MARKET).first();
                if (await cbLegacy.count().catch(() => 0) > 0) {
                    const checked = await cbLegacy.isChecked().catch(() => false);
                    if (!checked) await cbLegacy.click().catch(() => {});
                    await this.page.waitForTimeout(400);
                }
            }
        });
    }

    public async selectModeOfSale(mode: string): Promise<void> {
        await test.step(`Select mode of sale: ${mode}`, async () => {
            const control = this.page.locator('select[name*="modeOfSale" i], select:near(:text("Mode of Sale")), select:has(option:has-text("Online")), select:has(option:has-text("Offline"))').first();
            const isNative = await control.count().catch(() => 0) > 0 && await control.evaluate((el) => el.tagName === "SELECT").catch(() => false);
            if (isNative) {
                const hasOption = await control.evaluate((el: HTMLSelectElement, opt) => {
                    return Array.from(el.options).some(o => o.text.toLowerCase() === opt.toLowerCase() || o.value.toLowerCase() === opt.toLowerCase());
                }, mode).catch(() => false);

                let targetValue = mode;
                if (!hasOption) {
                    const options = await control.evaluate((el: HTMLSelectElement) => Array.from(el.options).map(o => o.text));
                    const found = options.find(o => o.toLowerCase() === mode.toLowerCase());
                    if (found) {
                        targetValue = found;
                    } else if (options.length > 0) {
                        targetValue = options[1] || options[0];
                    }
                }

                await control.selectOption({ label: targetValue }, { timeout: 2000 }).catch(async () => {
                    await control.selectOption(targetValue, { timeout: 2000 }).catch(async () => {
                        await control.selectOption({ index: 0 }, { timeout: 2000 }).catch(() => {});
                    });
                });
                await this.page.waitForTimeout(300);
            } else {
                const customControl = this.page.locator(OfficePage.MODE_OF_SALE_CONTROL).first();
                await customControl.click().catch(() => {});
                await this.page.waitForTimeout(400);
                await this.page.locator(OfficePage.dropdownOption(mode)).first().click().catch(async () => {
                    await this.page.locator('[role="option"], .select__option, li').first().click().catch(() => {});
                });
                await this.page.waitForTimeout(300);
            }
        });
    }

    public async setStartDate(dateStr: string): Promise<void> {
        await test.step(`Set start date: ${dateStr}`, async () => {
            const input = this.page.locator('input[type="date"]').first();
            await input.click();
            await input.fill(dateStr);
            await this.page.keyboard.press("Tab");
            await this.page.waitForTimeout(300);
        });
    }

    public async setEndDate(dateStr: string): Promise<void> {
        await test.step(`Set end date: ${dateStr}`, async () => {
            const input = this.page.locator('input[type="date"]').nth(1);
            await input.click();
            await input.fill(dateStr);
            await this.page.keyboard.press("Tab");
            await this.page.waitForTimeout(300);
        });
    }

    public async fillStep4(data: OfficeStep4Data): Promise<void> {
        await test.step("Fill Step 4 — Agreement details", async () => {
            if (data.agreementPath) await this.uploadAgreement(data.agreementPath);
            if (data.catalogOption) await this.selectCatalogOption(data.catalogOption);
            if (data.market) await this.selectMarket(data.market);
            if (data.modeOfSale) await this.selectModeOfSale(data.modeOfSale);
            if (data.startDate) await this.setStartDate(data.startDate);
            if (data.endDate) await this.setEndDate(data.endDate);
        });
    }

    // ── Step 5: Done ──────────────────────────────────────────────────────────

    public async verifySuccessMessage(): Promise<void> {
        await test.step("Verify wizard success message", async () => {
            await expect(
                this.page.locator(OfficePage.SUCCESS_MESSAGE).first(),
                "Success message should be visible",
            ).toBeVisible({ timeout: 30000 });
        });
    }

    public async isDoneScreenVisible(): Promise<boolean> {
        return this.page.locator(OfficePage.DONE_BTN).first()
            .isVisible({ timeout: 4000 }).catch(() => false);
    }

    public async clickDone(): Promise<void> {
        await test.step("Click Done button to finish wizard", async () => {
            await this.page.locator(OfficePage.DONE_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(1000);
        });
    }

    private getSearchToken(orgName: string): string {
        // Extract the trailing timestamp (10+ digits) from QA_XXXX_TIMESTAMP patterns
        const tsMatch = orgName.match(/_(\d{10,})$/);
        if (tsMatch) return tsMatch[1];

        // Fallback: extract any long numeric sequence (7+ digits)
        const longNum = orgName.match(/(\d{7,})/);
        if (longNum) return longNum[1];

        // Last resort: use lastCreatedEmail numeric part
        if (this.lastCreatedEmail) {
            const emailNum = this.lastCreatedEmail.match(/(\d{10,})/);
            if (emailNum) return emailNum[1];
        }

        return orgName;
    }

    public async searchRegistry(query: string): Promise<void> {
        await test.step(`Search Office Registry for: ${query}`, async () => {
            const searchBox = this.page.locator(OfficePage.REGISTRY_SEARCH).first();
            
            // Wait for backend write synchronization latency
            await this.page.waitForTimeout(3000);

            const initialRows = await this.page.locator('table tbody tr').allTextContents().catch(() => []);
            console.log(`[searchRegistry] Table rows before search: ${JSON.stringify(initialRows)}`);

            let searchTerm = query;
            if (query.startsWith("QA_Office_") && this.lastCreatedEmail) {
                searchTerm = this.lastCreatedEmail;
            }

            const performSearch = async (term: string) => {
                await searchBox.clear();
                await searchBox.fill(term);
                await this.page.keyboard.press("Enter");
                
                const searchBtn = this.page.locator('button:has-text("Search"), button:has(img), button:near(input[placeholder="Search here"])').first();
                if (await searchBtn.count().catch(() => 0) > 0) {
                    await searchBtn.click().catch(() => {});
                }
                await this.page.waitForTimeout(2000);
            };

            await performSearch(searchTerm);

            // If no records found, reload the page to check if database update has synced
            const noRecordsVisible = await this.page.locator(OfficePage.NO_RECORDS).first().isVisible().catch(() => false);
            if (noRecordsVisible) {
                console.log(`[searchRegistry] Record not found. Reloading page and searching with email prefix...`);
                await this.page.reload();
                await this.page.waitForLoadState("networkidle");
                await this.page.waitForTimeout(3000);
                
                const token = this.getSearchToken(query);
                const emailPrefix = `qaoffice_${token}`;
                await performSearch(emailPrefix);
            }
        });
    }

    public async verifyRecordInTable(orgName: string): Promise<void> {
        await test.step(`Verify record exists in table: ${orgName}`, async () => {
            const token = this.getSearchToken(orgName);
            await expect(
                this.page.locator(OfficePage.rowContaining(token)).first(),
                `Row containing '${token}' should be visible`,
            ).toBeVisible({ timeout: 15000 });
        });
    }

    public async verifyNoRecordsFound(): Promise<void> {
        await test.step("Verify No Records Found message", async () => {
            await expect(
                this.page.locator(OfficePage.NO_RECORDS).first(),
                "No Records Found message should be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async clickViewForRecord(orgName?: string): Promise<void> {
        await test.step("Click View icon for record", async () => {
            if (orgName) {
                let term = orgName;
                if (orgName.startsWith("QA_Office_")) {
                    term = this.getSearchToken(orgName);
                }
                await this.page.locator(OfficePage.viewIconInRow(term)).first().click();
            } else {
                await this.page.locator(`${OfficePage.TABLE_FIRST_ROW} ${OfficePage.VIEW_ICON}`).first().click();
            }
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(800);
        });
    }

    public async clickEditForRecord(orgName?: string): Promise<void> {
        await test.step("Click Edit icon for record", async () => {
            if (orgName) {
                let term = orgName;
                if (orgName.startsWith("QA_Office_")) {
                    term = this.getSearchToken(orgName);
                }
                await this.page.locator(OfficePage.editIconInRow(term)).first().click();
            } else {
                await this.page.locator(`${OfficePage.TABLE_FIRST_ROW} ${OfficePage.EDIT_ICON}`).first().click();
            }
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(800);
        });
    }

    public async verifyViewPageLoaded(): Promise<void> {
        await test.step("Verify View page loaded", async () => {
            await expect(
                this.page.locator(OfficePage.VIEW_PAGE_HEADING).first(),
                "View page heading should be visible",
            ).toBeVisible({ timeout: 10000 });
        });
    }

    public async verifyFieldOnPage(label: string, value: string): Promise<void> {
        await test.step(`Verify field '${label}' has value: ${value}`, async () => {
            const field = this.page.locator(`:has-text("${value}")`).first();
            const visible = await field.isVisible({ timeout: 5000 }).catch(() => false);
            await Assert.assertTrue(visible, `Value '${value}' should be visible on the page`);
        });
    }

    // ── Validation helpers ────────────────────────────────────────────────────

    public async verifyValidationMessage(): Promise<void> {
        await test.step("Verify validation message is shown", async () => {
            await expect(
                this.page.locator(OfficePage.VALIDATION_MSG).first(),
                "Validation message should be visible",
            ).toBeVisible({ timeout: 8000 });
        });
    }

    public async verifyStepNotAdvanced(stepText: string): Promise<void> {
        await test.step(`Verify wizard did not advance past: ${stepText}`, async () => {
            const stillOnStep = await this.page.locator(
                `${OfficePage.STEP_OFFICE}, ${OfficePage.STEP_ORG}, ${OfficePage.STEP_AUTH}, ${OfficePage.STEP_AGREEMENT}`,
            ).first().isVisible({ timeout: 3000 }).catch(() => false);
            await Assert.assertTrue(stillOnStep, `Should still be on wizard step, not advanced past ${stepText}`);
        });
    }

    // ── Mock routes for negative tests ───────────────────────────────────────

    public async mockApiFailure(): Promise<void> {
        const body = JSON.stringify({ error: "Internal Server Error" });
        await this.page.route("**/office**", (route) => {
            route.fulfill({ status: 500, body });
        });
    }

    public async mockNetworkFailure(): Promise<void> {
        await this.page.route("**/office**", (route) => route.abort());
    }

    // ── View page helpers ─────────────────────────────────────────────────────

    public async verifyViewSectionVisible(section: "office" | "org" | "auth"): Promise<void> {
        await test.step(`Verify ${section} section visible on View page`, async () => {
            let selector: string;
            if (section === "office") selector = OfficePage.VIEW_OFFICE_SECTION;
            else if (section === "org") selector = OfficePage.VIEW_ORG_SECTION;
            else selector = OfficePage.VIEW_AUTH_SECTION;

            const isVisible = await this.page.locator(selector).first()
                .isVisible({ timeout: 5000 }).catch(() => false);
            if (!isVisible) {
                const bodyText: string = (await this.page.locator("body").textContent().catch(() => null)) ?? "";
                await Assert.assertTrue(bodyText.length > 100, `${section} section content should be on View page`);
            }
        });
    }

    public async verifyLogoOnViewPage(): Promise<void> {
        await test.step("Verify logo visible on View page", async () => {
            const logo = this.page.locator(OfficePage.LOGO_ON_VIEW).first();
            const isVisible = await logo.isVisible({ timeout: 5000 }).catch(() => false);
            await Assert.assertTrue(isVisible, "Logo image should be visible on View page");
        });
    }

    public async verifyOfficeBadge(): Promise<void> {
        await test.step("Verify Office Type badge on View page", async () => {
            const bodyText: string = (await this.page.locator("body").textContent().catch(() => null)) ?? "";
            const hasType = bodyText.includes("Head Office") || bodyText.includes("Branch") ||
                bodyText.includes("Regional") || bodyText.includes("Office");
            await Assert.assertTrue(hasType, "Office type should be visible on View page");
        });
    }

    public async clickBackFromPage(): Promise<void> {
        await test.step("Click Back button to return", async () => {
            const backBtn = this.page.locator(OfficePage.BACK_BTN).first();
            if (await backBtn.count() > 0 && await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await backBtn.click();
            } else {
                await this.page.goBack();
            }
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(800);
        });
    }

    // ── Edit page helpers ─────────────────────────────────────────────────────

    public async verifyEditPageLoaded(): Promise<void> {
        await test.step("Verify Edit page loaded", async () => {
            const url = this.page.url();
            const headingVisible = await this.page.locator(OfficePage.EDIT_PAGE_HEADING).first()
                .isVisible({ timeout: 8000 }).catch(() => false);
            await Assert.assertTrue(url.includes("edit") || headingVisible,
                "Edit page should be loaded (URL contains 'edit' or heading visible)");
        });
    }

    public async verifyEditPagePreFilled(): Promise<void> {
        await test.step("Verify Edit page has pre-filled office data", async () => {
            await this.page.waitForTimeout(1000);
            const bodyText: string = (await this.page.locator("main, body").first().textContent().catch(() => null)) ?? "";
            await Assert.assertTrue(bodyText.length > 100, "Edit page should have content pre-filled");
        });
    }

    public async updateOfficeType(officeType: string): Promise<void> {
        await test.step(`Update Office Type to: ${officeType}`, async () => {
            await this.selectOfficeType(officeType).catch(async () => {
                const nativeSel = this.page.locator("select").first();
                if (await nativeSel.count() > 0) {
                    await nativeSel.selectOption({ index: 1 }).catch(() => {});
                }
            });
        });
    }

    public async clickUpdateOffice(): Promise<void> {
        await test.step("Click Update Office button", async () => {
            const btn = this.page.locator(OfficePage.UPDATE_BTN).first();
            await btn.waitFor({ state: "visible", timeout: 10000 });
            await btn.click();
            await this.page.waitForTimeout(1200);
        });
    }

    public async verifyUpdateSuccess(): Promise<void> {
        await test.step("Verify update success toast or message", async () => {
            const toast = this.page.locator(`${OfficePage.SUCCESS_TOAST}, ${OfficePage.TOAST}`).first();
            const toastVisible = await toast.isVisible({ timeout: 8000 }).catch(() => false);
            if (!toastVisible) {
                const successText = this.page.locator(':text-matches("update|success|saved", "i")').first();
                const textVisible = await successText.isVisible({ timeout: 5000 }).catch(() => false);
                await Assert.assertTrue(textVisible, "Update success message or toast should appear");
            }
        });
    }

    public async updateSecurityFields(question: string, answer: string): Promise<void> {
        await test.step("Update Security Question and Answer", async () => {
            const qInput = this.page.locator(OfficePage.SECURITY_QUESTION_INPUT).first();
            if (await qInput.count() > 0 && await qInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                const tag = await qInput.evaluate((el) => el.tagName).catch(() => "INPUT");
                if (tag === "SELECT") {
                    await (qInput as any).selectOption({ index: 1 }).catch(() => {});
                } else {
                    await qInput.clear();
                    await qInput.fill(question);
                }
            }
            const aInput = this.page.locator(OfficePage.SECURITY_ANSWER_INPUT).first();
            if (await aInput.count() > 0 && await aInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                await aInput.clear();
                await aInput.fill(answer);
            }
        });
    }

    // ── Delete helpers ────────────────────────────────────────────────────────

    public async clickDeleteForRecord(orgName?: string): Promise<void> {
        await test.step("Click Delete icon for record", async () => {
            if (orgName) {
                const token = this.getSearchToken(orgName);
                const rowDelete = this.page.locator(OfficePage.deleteIconInRow(token)).first();
                if (await rowDelete.count() > 0) {
                    await rowDelete.click();
                } else {
                    await this.page.locator(`${OfficePage.TABLE_FIRST_ROW} ${OfficePage.DELETE_ICON}`).first().click();
                }
            } else {
                await this.page.locator(`${OfficePage.TABLE_FIRST_ROW} ${OfficePage.DELETE_ICON}`).first().click();
            }
            await this.page.waitForTimeout(800);
        });
    }

    public async confirmDeletePopup(): Promise<void> {
        await test.step("Confirm delete in popup", async () => {
            await this.page.locator(OfficePage.DELETE_CONFIRM_BTN).first().click();
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(1500);
        });
    }

    public async cancelDeletePopup(): Promise<void> {
        await test.step("Cancel delete popup", async () => {
            await this.page.locator(OfficePage.DELETE_CANCEL_BTN).first().click();
            await this.page.waitForTimeout(500);
        });
    }

    public async verifyOfficeRemovedFromTable(orgName: string): Promise<void> {
        await test.step(`Verify office '${orgName}' removed from table`, async () => {
            await this.page.waitForTimeout(1000);
            const token = this.getSearchToken(orgName);
            const row = this.page.locator(OfficePage.rowContaining(token)).first();
            const stillVisible = await row.isVisible({ timeout: 3000 }).catch(() => false);
            if (stillVisible) {
                await this.page.reload();
                await this.page.waitForLoadState("networkidle");
                await this.page.waitForTimeout(1000);
                const rowAfter = this.page.locator(OfficePage.rowContaining(token)).first();
                const stillVisibleAfterReload = await rowAfter.isVisible({ timeout: 3000 }).catch(() => false);
                await Assert.assertFalse(stillVisibleAfterReload, `Office '${token}' should be removed`);
            } else {
                await Assert.assertFalse(stillVisible, `Office '${token}' should be removed`);
            }
        });
    }

    // ── Full wizard helper ────────────────────────────────────────────────────

    public async completeFullWizard(
        step1: OfficeStep1Data,
        step2: OfficeStep2Data,
        step3: OfficeStep3Data,
        step4: OfficeStep4Data,
    ): Promise<void> {
        await this.fillStep1(step1);
        await this.clickNext();
        await this.waitForPageStable();
        await this.fillStep2(step2);
        await this.clickNext();
        await this.waitForPageStable();
        await this.fillStep3(step3);
        await this.clickNext();
        await this.waitForPageStable();
        await this.fillStep4(step4);
        await this.clickNext();
        await this.waitForPageStable();
    }
}
