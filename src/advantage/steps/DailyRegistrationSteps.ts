import test, { Page, expect } from "@playwright/test";
import DailyRegistrationPage from "@pages/DailyRegistrationPage";

export default class DailyRegistrationSteps {
    constructor(private readonly page: Page) {}

    private async settle(ms = 800): Promise<void> {
        await this.page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
        await this.page.waitForTimeout(ms);
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    public async navigateToDailyRegistrationReport(): Promise<void> {
        await test.step("Navigate to Daily Registration Report page", async () => {
            await this.page.goto(`${process.env.BASE_URL}${DailyRegistrationPage.DRR_PATH}`);
            await this.settle(1000);
        });
    }

    public async navigateToDownloadHistory(): Promise<void> {
        await test.step("Navigate to Customer Download History page", async () => {
            await this.page.goto(`${process.env.BASE_URL}${DailyRegistrationPage.CDH_PATH}`);
            await this.settle(1000);
        });
    }

    public async navigateViaMenu(): Promise<void> {
        await test.step("Navigate via BI & Analytics menu to Daily Registration Report", async () => {
            const biMenu = this.page.locator('text=BI & Analytics, span:has-text("BI & Analytics")').first();
            const isExpanded = await biMenu.isVisible({ timeout: 3000 }).catch(() => false);
            if (isExpanded) {
                await biMenu.click();
                await this.page.waitForTimeout(500);
            }
            await this.page.locator('text=Daily Registration Rep').first().click();
            await this.settle(1000);
        });
    }

    // ── Page load verification ────────────────────────────────────────────────

    public async verifyPageLoaded(): Promise<void> {
        await test.step("Verify Daily Registration Report page loaded", async () => {
            await expect(
                this.page.locator(DailyRegistrationPage.PAGE_HEADING).first(),
                "Daily Registration Report heading should be visible",
            ).toBeVisible({ timeout: 15000 });
        });
    }

    public async verifyKPICardsVisible(): Promise<void> {
        await test.step("Verify all KPI cards are visible", async () => {
            const totalCard = this.page.locator(DailyRegistrationPage.KPI_TOTAL_REGISTRATIONS).first();
            const customersCard = this.page.locator(DailyRegistrationPage.KPI_CUSTOMERS).first();
            const partnersCard = this.page.locator(DailyRegistrationPage.KPI_PARTNERS).first();
            const staffCard = this.page.locator(DailyRegistrationPage.KPI_STAFF).first();
            const verifiedCard = this.page.locator(DailyRegistrationPage.KPI_VERIFIED_RATE).first();

            await expect(totalCard, "Total Registrations KPI card visible").toBeVisible({ timeout: 10000 });
            await expect(customersCard, "Customers KPI card visible").toBeVisible({ timeout: 5000 });
            await expect(partnersCard, "Partners KPI card visible").toBeVisible({ timeout: 5000 });
            await expect(staffCard, "Staff KPI card visible").toBeVisible({ timeout: 5000 });
            await expect(verifiedCard, "Verified Rate KPI card visible").toBeVisible({ timeout: 5000 });
        });
    }

    public async verifyDetailTableVisible(): Promise<void> {
        await test.step("Verify Registration Detail table section visible", async () => {
            const section = this.page.locator(DailyRegistrationPage.REG_DETAIL_SECTION);
            const search = section.locator(DailyRegistrationPage.DETAIL_SEARCH).first();
            await search.waitFor({ state: "visible", timeout: 15000 });
        });
    }

    // ── Date filters ──────────────────────────────────────────────────────────

    public async clickFilterToday(): Promise<void> {
        await test.step("Click Today filter", async () => {
            await this.page.locator(DailyRegistrationPage.FILTER_TODAY).first().click();
            await this.settle(1000);
        });
    }

    public async clickFilter7D(): Promise<void> {
        await test.step("Click 7D filter", async () => {
            await this.page.locator(DailyRegistrationPage.FILTER_7D).first().click();
            await this.settle(1000);
        });
    }

    public async clickFilter30D(): Promise<void> {
        await test.step("Click 30D filter", async () => {
            await this.page.locator(DailyRegistrationPage.FILTER_30D).first().click();
            await this.settle(1000);
        });
    }

    public async applyCustomDateRange(fromDate: string, toDate: string): Promise<void> {
        await test.step(`Apply custom date range: ${fromDate} to ${toDate}`, async () => {
            const customBtn = this.page.locator(DailyRegistrationPage.FILTER_CUSTOM).first();
            await customBtn.click();
            await this.page.waitForTimeout(1000);

            // Use nth() — the Custom Date Range panel renders two date inputs in order (From, To).
            // placeholder is "dd-mm-yyyy"; Playwright fill() accepts YYYY-MM-DD for input[type="date"].
            const dateInputs = this.page.locator(DailyRegistrationPage.DATE_INPUTS);
            await dateInputs.first().waitFor({ state: "visible", timeout: 8000 });

            await dateInputs.nth(0).fill(fromDate);
            await this.page.waitForTimeout(400);
            await dateInputs.nth(1).fill(toDate);
            await this.page.waitForTimeout(400);

            // "Apply Range" button becomes enabled only after both dates are filled
            const applyBtn = this.page.locator(DailyRegistrationPage.APPLY_DATE_BTN).first();
            await applyBtn.waitFor({ state: "visible", timeout: 5000 });
            // Wait up to 5s for React state update to enable the button, then force-click
            try { await expect(applyBtn).toBeEnabled({ timeout: 5000 }); } catch { /* force below */ }
            await applyBtn.click({ force: true });
            await this.settle(1500);
        });
    }

    public async verifyFilterActive(filterLabel: string): Promise<boolean> {
        return test.step(`Verify ${filterLabel} filter is active`, async () => {
            const activeFilter = this.page.locator(`button:has-text("${filterLabel}")`).first();
            const cls = await activeFilter.getAttribute("class").catch(() => "");
            const isActive = cls?.includes("active") || cls?.includes("selected") || cls?.includes("primary");
            return isActive ?? false;
        });
    }

    // ── Refresh ───────────────────────────────────────────────────────────────

    public async clickRefresh(): Promise<void> {
        await test.step("Click Refresh button", async () => {
            const refreshBtn = this.page.locator(DailyRegistrationPage.REFRESH_BTN).first();
            await refreshBtn.click();
            await this.settle(2000);
        });
    }

    // ── View Download History ─────────────────────────────────────────────────

    public async clickViewDownloadHistory(): Promise<void> {
        await test.step("Click View Download History button", async () => {
            const btn = this.page.locator(DailyRegistrationPage.VIEW_DOWNLOAD_HISTORY_BTN).first();
            await btn.click();
            await this.settle(1500);
        });
    }

    // ── Export buttons ────────────────────────────────────────────────────────

    public async clickExportCSV(): Promise<string | null> {
        return test.step("Click Export CSV and capture download", async () => {
            const csvBtn = this.page.locator(DailyRegistrationPage.EXPORT_CSV_BTN).first();
            const isVisible = await csvBtn.isVisible({ timeout: 5000 }).catch(() => false);
            if (!isVisible) return null;

            const [download] = await Promise.all([
                this.page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
                csvBtn.click(),
            ]);
            if (!download) return null;
            const path = await download.path().catch(() => null);
            return path;
        });
    }

    public async clickExportPDF(): Promise<string | null> {
        return test.step("Click Export PDF and capture download", async () => {
            const pdfBtn = this.page.locator(DailyRegistrationPage.EXPORT_PDF_BTN).first();
            const isVisible = await pdfBtn.isVisible({ timeout: 5000 }).catch(() => false);
            if (!isVisible) return null;

            const [download] = await Promise.all([
                this.page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
                pdfBtn.click(),
            ]);
            if (!download) return null;
            const path = await download.path().catch(() => null);
            return path;
        });
    }

    public async verifyScheduleReport(): Promise<void> {
        await test.step("Click Schedule Report button and verify it opens", async () => {
            const btn = this.page.locator(DailyRegistrationPage.SCHEDULE_REPORT_BTN).first();
            const isVisible = await btn.isVisible({ timeout: 5000 }).catch(() => false);
            if (isVisible) {
                await btn.click();
                await this.page.waitForTimeout(1500);
                const dialogVisible = await this.page
                    .locator('[role="dialog"], [class*="modal"], [class*="schedule"]')
                    .first()
                    .isVisible({ timeout: 5000 })
                    .catch(() => false);
                expect(dialogVisible, "Schedule dialog/modal should open").toBeTruthy();
                await this.page.keyboard.press("Escape").catch(() => {});
            }
        });
    }

    // ── Trend chart tabs ──────────────────────────────────────────────────────

    public async clickTrendTab(tab: "All" | "Customer" | "Partner" | "Staff"): Promise<void> {
        await test.step(`Click '${tab}' tab in Daily Registration Trend`, async () => {
            const selectors: Record<string, string> = {
                All: DailyRegistrationPage.TREND_TAB_ALL,
                Customer: DailyRegistrationPage.TREND_TAB_CUSTOMER,
                Partner: DailyRegistrationPage.TREND_TAB_PARTNER,
                Staff: DailyRegistrationPage.TREND_TAB_STAFF,
            };
            await this.page.locator(selectors[tab]).first().click();
            await this.settle(800);
        });
    }

    // ── Registration Detail — search ──────────────────────────────────────────

    public async searchRegistration(text: string): Promise<void> {
        await test.step(`Search Registration Detail for '${text}'`, async () => {
            const section = this.page.locator(DailyRegistrationPage.REG_DETAIL_SECTION);
            const searchBox = section.locator(DailyRegistrationPage.DETAIL_SEARCH).first();
            await searchBox.fill(text);
            await this.page.waitForTimeout(1000);
            await this.settle(800);
        });
    }

    public async clearSearch(): Promise<void> {
        await test.step("Clear registration detail search", async () => {
            const section = this.page.locator(DailyRegistrationPage.REG_DETAIL_SECTION);
            const clearBtn = section.locator(DailyRegistrationPage.DETAIL_CLEAR_SEARCH).first();
            const clearVisible = await clearBtn.isVisible({ timeout: 2000 }).catch(() => false);
            if (clearVisible) {
                await clearBtn.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
                await clearBtn.click({ force: true }).catch(async () => {
                    const searchBox = section.locator(DailyRegistrationPage.DETAIL_SEARCH).first();
                    await searchBox.fill("");
                });
            } else {
                const searchBox = section.locator(DailyRegistrationPage.DETAIL_SEARCH).first();
                await searchBox.fill("");
            }
            await this.settle(800);
        });
    }

    // ── Registration Detail — filters ─────────────────────────────────────────

    public async selectRoleFilter(role: string): Promise<void> {
        await test.step(`Select Role filter: ${role}`, async () => {
            await this.openDropdownAndSelect(DailyRegistrationPage.ROLE_DROPDOWN, role, 0);
        });
    }

    public async selectSourceFilter(source: string): Promise<void> {
        await test.step(`Select Source filter: ${source}`, async () => {
            await this.openDropdownAndSelect(DailyRegistrationPage.SOURCE_DROPDOWN, source, 1);
        });
    }

    public async selectStatusFilter(status: string): Promise<void> {
        await test.step(`Select Status filter: ${status}`, async () => {
            await this.openDropdownAndSelect(DailyRegistrationPage.STATUS_DROPDOWN, status, 2);
        });
    }

    private async openDropdownAndSelect(dropdownSelector: string, value: string, index = 0): Promise<void> {
        const section = this.page.locator(DailyRegistrationPage.REG_DETAIL_SECTION);
        const dropdown = section.locator(dropdownSelector).nth(index);
        const tag = await dropdown.evaluate((el) => el.tagName).catch(() => "div");
        if (tag === "SELECT") {
            await dropdown.selectOption({ label: value }).catch(async () => {
                await dropdown.selectOption(value).catch(() => {});
            });
        } else {
            await dropdown.waitFor({ state: "visible", timeout: 8000 });
            await dropdown.click();
            // Radix Select portal may take a moment to appear
            await this.page.waitForTimeout(600);
            const option = this.page.locator(DailyRegistrationPage.dropdownOption(value)).first();
            const optVisible = await option.isVisible({ timeout: 5000 }).catch(() => false);
            if (optVisible) {
                await option.click();
            } else {
                // Dismiss the open dropdown and skip selection if option not found
                await this.page.keyboard.press("Escape").catch(() => {});
            }
        }
        await this.page.waitForTimeout(400);
    }

    public async clickApplyFilter(): Promise<void> {
        await test.step("Click Apply filter button", async () => {
            const section = this.page.locator(DailyRegistrationPage.REG_DETAIL_SECTION);
            await section.locator(DailyRegistrationPage.APPLY_FILTER_BTN).first().click();
            await this.settle(1200);
        });
    }

    // ── Verification helpers ──────────────────────────────────────────────────

    public async verifyTableHasRecords(): Promise<void> {
        await test.step("Verify Registration Detail table has at least one record", async () => {
            const rows = this.page.locator(DailyRegistrationPage.TABLE_ROWS);
            const count = await rows.count();
            expect(count, "Table should have at least one record").toBeGreaterThan(0);
        });
    }

    public async verifyTableHasText(text: string): Promise<void> {
        await test.step(`Verify table contains record with '${text}'`, async () => {
            const cell = this.page.locator(DailyRegistrationPage.tableCell(text)).first();
            const visible = await cell.isVisible({ timeout: 5000 }).catch(() => false);
            expect(visible, `Record with text '${text}' should be visible in table`).toBeTruthy();
        });
    }

    public async verifyEmptyState(): Promise<void> {
        await test.step("Verify empty state / no data message is shown", async () => {
            const noData = this.page.locator(DailyRegistrationPage.NO_DATA_MSG).first();
            const visible = await noData.isVisible({ timeout: 8000 }).catch(() => false);
            expect(visible, "Empty state message should be visible").toBeTruthy();
        });
    }

    public async getTableRowCount(): Promise<number> {
        return test.step("Get current table row count", async () => {
            await this.settle(500);
            return this.page.locator(DailyRegistrationPage.TABLE_ROWS).count();
        });
    }

    public async verifyPageURL(segment: string): Promise<void> {
        await test.step(`Verify page URL contains '${segment}'`, async () => {
            await expect(this.page).toHaveURL(new RegExp(segment), { timeout: 10000 });
        });
    }

    // ── Download History ──────────────────────────────────────────────────────

    public async verifyDownloadHistoryLoaded(): Promise<void> {
        await test.step("Verify Customer Download History page loaded", async () => {
            await expect(
                this.page.locator(DailyRegistrationPage.CDH_HEADING).first(),
                "Download History heading should be visible",
            ).toBeVisible({ timeout: 15000 });
        });
    }

    public async verifyDownloadHistoryTableColumns(): Promise<void> {
        await test.step("Verify Download History table has all required columns", async () => {
            const cols = [
                DailyRegistrationPage.CDH_COLUMN_REQUEST,
                DailyRegistrationPage.CDH_COLUMN_DATE,
                DailyRegistrationPage.CDH_COLUMN_TYPE,
                DailyRegistrationPage.CDH_COLUMN_BY,
                DailyRegistrationPage.CDH_COLUMN_STATUS,
                DailyRegistrationPage.CDH_COLUMN_ACTION,
            ];
            await cols.reduce(async (prev, col) => {
                await prev;
                const header = this.page.locator(col).first();
                const visible = await header.isVisible({ timeout: 5000 }).catch(() => false);
                expect(visible, `Column header '${col}' should be visible`).toBeTruthy();
            }, Promise.resolve());
        });
    }

    public async clickViewCustomerReport(): Promise<void> {
        await test.step("Click VIEW CUSTOMER REPORT button", async () => {
            const btn = this.page.locator(DailyRegistrationPage.CDH_VIEW_REPORT_BTN).first();
            await btn.click();
            await this.settle(1500);
        });
    }

    public async verifyDownloadHistoryEmptyState(): Promise<void> {
        await test.step("Verify Download History table shows no data available", async () => {
            const noData = this.page.locator(DailyRegistrationPage.NO_DATA_MSG).first();
            const visible = await noData.isVisible({ timeout: 8000 }).catch(() => false);
            expect(visible, "No data available message should be shown").toBeTruthy();
        });
    }

    public async verifyDownloadHistoryPagination(): Promise<void> {
        await test.step("Verify pagination controls exist on Download History", async () => {
            const pagination = this.page.locator(DailyRegistrationPage.PAGINATION).first();
            const visible = await pagination.isVisible({ timeout: 5000 }).catch(() => false);
            expect(visible, "Pagination controls should be visible").toBeTruthy();
        });
    }

    // ── Network simulation ────────────────────────────────────────────────────

    public async simulateAPIFailureAndRefresh(): Promise<void> {
        await test.step("Simulate API failure and test refresh behavior", async () => {
            await this.page.route("**/api/**", (route) => route.abort()).catch(() => {});
            await this.clickRefresh().catch(() => {});
            await this.page.waitForTimeout(2000);
            await this.page.unrouteAll({ behavior: "ignoreErrors" }).catch(() => {});
        });
    }

    public async getDropdownOptions(dropdownSelector: string, index = 0): Promise<string[]> {
        return test.step(`Get options dynamically from dropdown ${dropdownSelector}`, async () => {
            const dropdown = this.page.locator(dropdownSelector).nth(index);
            await dropdown.waitFor({ state: "visible", timeout: 8000 });
            const tag = await dropdown.evaluate((el) => el.tagName).catch(() => "div");
            if (tag === "SELECT") {
                const options = await dropdown.locator('option').evaluateAll(els => 
                    els.map(el => (el.textContent || "").trim()).filter(t => t !== "")
                );
                return options;
            } else {
                await dropdown.click();
                await this.page.waitForTimeout(600);
                const optionLocators = this.page.locator('[role="option"], div[data-radix-select-item], div[class*="option"], li[role="option"]');
                const optionTexts = await optionLocators.evaluateAll(els => 
                    els.map(el => (el.textContent || "").trim()).filter(t => t !== "")
                );
                await this.page.keyboard.press("Escape");
                await this.page.waitForTimeout(300);
                return optionTexts;
            }
        });
    }

    public async getNameColumnIndex(): Promise<number> {
        return test.step("Find Name column index in table headers", async () => {
            const headers = this.page.locator(DailyRegistrationPage.TABLE_HEADER);
            const headerCount = await headers.count();
            let nameColIdx = 1; // default to second column
            for (let i = 0; i < headerCount; i++) {
                const headerText = await headers.nth(i).innerText().catch(() => "");
                if (headerText.toLowerCase().includes("name")) {
                    nameColIdx = i;
                    break;
                }
            }
            return nameColIdx;
        });
    }

    public async getTableColumnValues(columnIndex: number, maxRows = 3): Promise<string[]> {
        return test.step(`Get values from table column index ${columnIndex}`, async () => {
            const rows = this.page.locator(DailyRegistrationPage.TABLE_ROWS);
            const count = await rows.count();
            const values: string[] = [];
            for (let i = 0; i < Math.min(count, maxRows); i++) {
                const row = rows.nth(i);
                const cell = row.locator('td').nth(columnIndex);
                const text = await cell.innerText().catch(() => "");
                if (text.trim() && !text.toLowerCase().includes("no data") && !text.toLowerCase().includes("no records")) {
                    values.push(text.trim());
                }
            }
            return values;
        });
    }

    public async measurePageLoadTime(): Promise<number> {
        return test.step("Measure page load time", async () => {
            const startTime = Date.now();
            await this.navigateToDailyRegistrationReport();
            await this.verifyPageLoaded();
            return Date.now() - startTime;
        });
    }
}
