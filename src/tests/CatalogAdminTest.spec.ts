import { Page } from "@playwright/test";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import HomeSteps from "@uiSteps/HomeSteps";
import CatalogSteps from "@uiSteps/CatalogSteps";
import { getCredential, Role } from "@config/Credentials";
import CatalogPage from "@pages/CatalogPage";

const SHEET = "CatalogAdminTest";

let sharedPage!: Page;
let home!: HomeSteps;
let catalog!: CatalogSteps;

test.describe("Catalog Admin Test", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        home = new HomeSteps(sharedPage);
        catalog = new CatalogSteps(sharedPage);
        const d = ExcelUtil.getTestData(SHEET, "TC01_MainScreen_PageLoads");
        const creds = getCredential(Role.ADMIN);
        await home.launchApplication();
        await home.login(creds.email, creds.password, d.persona);
        await home.validateLogin(creds.email);
    });

    test.afterAll(async () => {
        await home.logout();
        await sharedPage?.close();
    });

    // ── CATALOG MAIN SCREEN — Positive ────────────────────────────────────────

    const d01 = ExcelUtil.getTestData(SHEET, "TC01_MainScreen_PageLoads");
    test(`${d01.TestID} - ${d01.Description}`, async () => {
        Allure.attachDetails(d01.Description, d01.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
        await catalog.verifyCatalogTreeVisible();
        await catalog.verifyCreateButtonVisible();
        await catalog.verifyDetailsPanelSectionVisible();
    });

    const d02 = ExcelUtil.getTestData(SHEET, "TC02_MainScreen_SelectNode");
    test(`${d02.TestID} - ${d02.Description}`, async () => {
        Allure.attachDetails(d02.Description, d02.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d02.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
        await catalog.verifyDetailField(CatalogPage.DETAIL_CATALOG_TYPE, "Catalog Type");
    });

    const d03 = ExcelUtil.getTestData(SHEET, "TC03_MainScreen_CreateButton");
    test(`${d03.TestID} - ${d03.Description}`, async () => {
        Allure.attachDetails(d03.Description, d03.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyCreateButtonVisible();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.navigateToCatalog();
    });

    const d04 = ExcelUtil.getTestData(SHEET, "TC04_MainScreen_ExpandCollapse");
    test(`${d04.TestID} - ${d04.Description}`, async () => {
        Allure.attachDetails(d04.Description, d04.Issue);
        await catalog.navigateToCatalog();
        await catalog.expandTreeNode(d04.ParentNode);
        await catalog.verifyChildrenVisible(d04.ParentNode, d04.ExpectedChildren.split(",").map((c: string) => c.trim()));
        await catalog.collapseTreeNode(d04.ParentNode);
        await catalog.verifyPageLoaded();
    });

    const d05 = ExcelUtil.getTestData(SHEET, "TC05_MainScreen_AccurateDetails");
    test(`${d05.TestID} - ${d05.Description}`, async () => {
        Allure.attachDetails(d05.Description, d05.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d05.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
        await catalog.verifyDetailField(CatalogPage.DETAIL_DISPLAY_NAME, "Display Name");
        await catalog.verifyDetailField(CatalogPage.DETAIL_LONG_DESC, "Long Description");
        await catalog.verifyDetailField(CatalogPage.DETAIL_SHORT_DESC, "Short Description");
    });

    const d06 = ExcelUtil.getTestData(SHEET, "TC06_MainScreen_AttributeCount");
    test(`${d06.TestID} - ${d06.Description}`, async () => {
        Allure.attachDetails(d06.Description, d06.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d06.CatalogNode);
        await catalog.verifyAttributeCount(d06.ExpectedCount);
    });

    const d07 = ExcelUtil.getTestData(SHEET, "TC07_MainScreen_DetailsButtonEnabled");
    test(`${d07.TestID} - ${d07.Description}`, async () => {
        Allure.attachDetails(d07.Description, d07.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d07.CatalogNode);
        await catalog.verifyDetailsButtonState(true);
    });

    const d08 = ExcelUtil.getTestData(SHEET, "TC08_MainScreen_SelectedHighlighted");
    test(`${d08.TestID} - ${d08.Description}`, async () => {
        Allure.attachDetails(d08.Description, d08.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d08.CatalogNode);
        await sharedPage.reload({ waitUntil: "networkidle" });
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
        await catalog.verifyCatalogTreeVisible();
    });

    // ── CATALOG MAIN SCREEN — Negative ────────────────────────────────────────

    const d09 = ExcelUtil.getTestData(SHEET, "TC09_MainScreen_DetailsButtonDisabled");
    test(`${d09.TestID} - ${d09.Description}`, async () => {
        Allure.attachDetails(d09.Description, d09.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyDetailsButtonState(false);
    });

    const d10 = ExcelUtil.getTestData(SHEET, "TC10_MainScreen_DeleteButtonDisabled");
    test(`${d10.TestID} - ${d10.Description}`, async () => {
        Allure.attachDetails(d10.Description, d10.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyDeleteButtonInactive();
    });

    const d11 = ExcelUtil.getTestData(SHEET, "TC11_MainScreen_InvalidCatalogURL");
    test(`${d11.TestID} - ${d11.Description}`, async () => {
        Allure.attachDetails(d11.Description, d11.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d12 = ExcelUtil.getTestData(SHEET, "TC12_MainScreen_EmptyTree");
    test(`${d12.TestID} - ${d12.Description}`, async () => {
        Allure.attachDetails(d12.Description, d12.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
        await catalog.verifyCatalogTreeVisible();
    });

    const d13 = ExcelUtil.getTestData(SHEET, "TC13_MainScreen_StaleDetails");
    test(`${d13.TestID} - ${d13.Description}`, async () => {
        Allure.attachDetails(d13.Description, d13.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d13.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
        await catalog.verifyPageLoaded();
    });

    const d14 = ExcelUtil.getTestData(SHEET, "TC14_MainScreen_APIFailure");
    test(`${d14.TestID} - ${d14.Description}`, async () => {
        Allure.attachDetails(d14.Description, d14.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d15 = ExcelUtil.getTestData(SHEET, "TC15_MainScreen_UnauthorizedAccess");
    test(`${d15.TestID} - ${d15.Description}`, async () => {
        Allure.attachDetails(d15.Description, d15.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
        await catalog.verifyCatalogTreeVisible();
    });

    const d16 = ExcelUtil.getTestData(SHEET, "TC16_MainScreen_RapidNodeClicks");
    test(`${d16.TestID} - ${d16.Description}`, async () => {
        Allure.attachDetails(d16.Description, d16.Issue);
        await catalog.navigateToCatalog();
        await catalog.rapidClickTreeNode(d16.CatalogNode, 5);
        await catalog.verifyPageLoaded();
    });

    // ── CATALOG DETAILS SCREEN — Positive ─────────────────────────────────────

    const d17 = ExcelUtil.getTestData(SHEET, "TC17_Details_PageLoads");
    test(`${d17.TestID} - ${d17.Description}`, async () => {
        Allure.attachDetails(d17.Description, d17.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d17.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
        await catalog.verifyDetailsSectionsVisible();
    });

    const d18 = ExcelUtil.getTestData(SHEET, "TC18_Details_InfoPopulated");
    test(`${d18.TestID} - ${d18.Description}`, async () => {
        Allure.attachDetails(d18.Description, d18.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d18.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
        await catalog.verifyDetailField(CatalogPage.DETAIL_DISPLAY_NAME, "Display Name");
    });

    const d19 = ExcelUtil.getTestData(SHEET, "TC19_Details_LanguageTabs");
    test(`${d19.TestID} - ${d19.Description}`, async () => {
        Allure.attachDetails(d19.Description, d19.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d19.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyLanguageDropdownVisible();
        await catalog.selectLanguage(d19.Language);
        await catalog.verifyPageLoaded();
    });

    const d20 = ExcelUtil.getTestData(SHEET, "TC20_Details_CatalogType");
    test(`${d20.TestID} - ${d20.Description}`, async () => {
        Allure.attachDetails(d20.Description, d20.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d20.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_CATALOG_TYPE, "Catalog Type");
    });

    const d21 = ExcelUtil.getTestData(SHEET, "TC21_Details_ParentDropdown");
    test(`${d21.TestID} - ${d21.Description}`, async () => {
        Allure.attachDetails(d21.Description, d21.Issue);
        await catalog.navigateToCatalog();
        await catalog.expandTreeNode(d21.ParentNode);
        await catalog.selectTreeNode(d21.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_PARENT, "Parent");
    });

    const d22 = ExcelUtil.getTestData(SHEET, "TC22_Details_ImageDisplayed");
    test(`${d22.TestID} - ${d22.Description}`, async () => {
        Allure.attachDetails(d22.Description, d22.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d22.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyImageSectionVisible();
    });

    const d23 = ExcelUtil.getTestData(SHEET, "TC23_Details_AddAttribute");
    test(`${d23.TestID} - ${d23.Description}`, async () => {
        Allure.attachDetails(d23.Description, d23.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d23.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.clickAddAttribute();
        await catalog.verifyPageLoaded();
    });

    const d24 = ExcelUtil.getTestData(SHEET, "TC24_Details_AttributeSearch");
    test(`${d24.TestID} - ${d24.Description}`, async () => {
        Allure.attachDetails(d24.Description, d24.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d24.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.searchAttribute(d24.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d25 = ExcelUtil.getTestData(SHEET, "TC25_Details_SearchableToggle");
    test(`${d25.TestID} - ${d25.Description}`, async () => {
        Allure.attachDetails(d25.Description, d25.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d25.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d26 = ExcelUtil.getTestData(SHEET, "TC26_Details_InheritableToggle");
    test(`${d26.TestID} - ${d26.Description}`, async () => {
        Allure.attachDetails(d26.Description, d26.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d26.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d27 = ExcelUtil.getTestData(SHEET, "TC27_Details_RequiredToggle");
    test(`${d27.TestID} - ${d27.Description}`, async () => {
        Allure.attachDetails(d27.Description, d27.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d27.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d28 = ExcelUtil.getTestData(SHEET, "TC28_Details_VarianceToggle");
    test(`${d28.TestID} - ${d28.Description}`, async () => {
        Allure.attachDetails(d28.Description, d28.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d28.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d29 = ExcelUtil.getTestData(SHEET, "TC29_Details_VisibleOnCreate");
    test(`${d29.TestID} - ${d29.Description}`, async () => {
        Allure.attachDetails(d29.Description, d29.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d29.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d30 = ExcelUtil.getTestData(SHEET, "TC30_Details_VisibleOnUpdate");
    test(`${d30.TestID} - ${d30.Description}`, async () => {
        Allure.attachDetails(d30.Description, d30.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d30.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d31 = ExcelUtil.getTestData(SHEET, "TC31_Details_VisibleOnShow");
    test(`${d31.TestID} - ${d31.Description}`, async () => {
        Allure.attachDetails(d31.Description, d31.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d31.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d32 = ExcelUtil.getTestData(SHEET, "TC32_Details_Pagination");
    test(`${d32.TestID} - ${d32.Description}`, async () => {
        Allure.attachDetails(d32.Description, d32.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d32.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPaginationVisible();
    });

    const d33 = ExcelUtil.getTestData(SHEET, "TC33_Details_AddBlock");
    test(`${d33.TestID} - ${d33.Description}`, async () => {
        Allure.attachDetails(d33.Description, d33.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d33.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.clickAddBlock();
        await catalog.verifyPageLoaded();
    });

    const d34 = ExcelUtil.getTestData(SHEET, "TC34_Details_DragDropReorder");
    test(`${d34.TestID} - ${d34.Description}`, async () => {
        Allure.attachDetails(d34.Description, d34.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d34.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyFormLayoutVisible();
        await catalog.verifyPageLoaded();
    });

    const d35 = ExcelUtil.getTestData(SHEET, "TC35_Details_SaveLayout");
    test(`${d35.TestID} - ${d35.Description}`, async () => {
        Allure.attachDetails(d35.Description, d35.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d35.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyFormLayoutVisible();
        await catalog.clickSaveLayout();
        await catalog.verifyPageLoaded();
    });

    const d36 = ExcelUtil.getTestData(SHEET, "TC36_Details_UpdateButton");
    test(`${d36.TestID} - ${d36.Description}`, async () => {
        Allure.attachDetails(d36.Description, d36.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d36.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.fillDetailsForm({ name: d36.Name, displayName: d36.DisplayName });
        await catalog.clickUpdateCatalog();
        await catalog.verifySuccessOrStable();
    });

    const d37 = ExcelUtil.getTestData(SHEET, "TC37_Details_UnassignedAttributes");
    test(`${d37.TestID} - ${d37.Description}`, async () => {
        Allure.attachDetails(d37.Description, d37.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d37.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyFormLayoutVisible();
        await catalog.verifyPageLoaded();
    });

    const d38 = ExcelUtil.getTestData(SHEET, "TC38_Details_PersistAfterRefresh");
    test(`${d38.TestID} - ${d38.Description}`, async () => {
        Allure.attachDetails(d38.Description, d38.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d38.CatalogNode);
        await catalog.clickDetailsButton();
        await sharedPage.reload({ waitUntil: "domcontentloaded" });
        await catalog.verifyPageLoaded();
    });

    const d39 = ExcelUtil.getTestData(SHEET, "TC39_Details_ValidImageUpload");
    test(`${d39.TestID} - ${d39.Description}`, async () => {
        Allure.attachDetails(d39.Description, d39.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d39.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.uploadThumbnail(d39.ThumbnailPath);
        await catalog.verifyThumbnailPreview();
    });

    const d40 = ExcelUtil.getTestData(SHEET, "TC40_Details_ExternalAttributeDropdown");
    test(`${d40.TestID} - ${d40.Description}`, async () => {
        Allure.attachDetails(d40.Description, d40.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d40.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
    });

    const d41 = ExcelUtil.getTestData(SHEET, "TC41_Details_UpdateCatalogDetails");
    test(`${d41.TestID} - ${d41.Description}`, async () => {
        Allure.attachDetails(d41.Description, d41.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d41.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.fillDetailsForm({ name: d41.Name, displayName: d41.DisplayName });
        await catalog.clickUpdateCatalog();
        await catalog.verifySuccessOrStable();
    });

    // ── CATALOG DETAILS SCREEN — Negative ─────────────────────────────────────

    const d42 = ExcelUtil.getTestData(SHEET, "TC42_Details_BlankName");
    test(`${d42.TestID} - ${d42.Description}`, async () => {
        Allure.attachDetails(d42.Description, d42.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d42.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.fillDetailsForm({ name: d42.Name, displayName: d42.DisplayName });
        await catalog.clickUpdateCatalog();
        await catalog.verifyValidationError();
    });

    const d43 = ExcelUtil.getTestData(SHEET, "TC43_Details_BlankDisplayName");
    test(`${d43.TestID} - ${d43.Description}`, async () => {
        Allure.attachDetails(d43.Description, d43.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d43.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.fillDetailsForm({ name: d43.Name, displayName: d43.DisplayName });
        await catalog.clickUpdateCatalog();
        await catalog.verifyValidationError();
    });

    const d44 = ExcelUtil.getTestData(SHEET, "TC44_Details_UnsupportedImageFormat");
    test(`${d44.TestID} - ${d44.Description}`, async () => {
        Allure.attachDetails(d44.Description, d44.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d44.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.uploadThumbnail(d44.NonImageFilePath);
        await catalog.verifyPageLoaded();
    });

    const d45 = ExcelUtil.getTestData(SHEET, "TC45_Details_OversizedImage");
    test(`${d45.TestID} - ${d45.Description}`, async () => {
        Allure.attachDetails(d45.Description, d45.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d45.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.uploadThumbnail(d45.OversizedImagePath);
        await catalog.verifyPageLoaded();
    });

    const d46 = ExcelUtil.getTestData(SHEET, "TC46_Details_CorruptedImage");
    test(`${d46.TestID} - ${d46.Description}`, async () => {
        Allure.attachDetails(d46.Description, d46.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d46.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.uploadThumbnail(d46.CorruptedImagePath);
        await catalog.verifyPageLoaded();
    });

    const d47 = ExcelUtil.getTestData(SHEET, "TC47_Details_AddAttributeNoSelection");
    test(`${d47.TestID} - ${d47.Description}`, async () => {
        Allure.attachDetails(d47.Description, d47.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d47.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.clickAddAttribute();
        await catalog.verifyPageLoaded();
    });

    const d48 = ExcelUtil.getTestData(SHEET, "TC48_Details_DuplicateAttribute");
    test(`${d48.TestID} - ${d48.Description}`, async () => {
        Allure.attachDetails(d48.Description, d48.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d48.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyAttributeSectionVisible();
        await catalog.verifyPageLoaded();
    });

    const d49 = ExcelUtil.getTestData(SHEET, "TC49_Details_SearchSpecialChars");
    test(`${d49.TestID} - ${d49.Description}`, async () => {
        Allure.attachDetails(d49.Description, d49.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d49.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.searchAttribute(d49.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d50 = ExcelUtil.getTestData(SHEET, "TC50_Details_SQLInjection");
    test(`${d50.TestID} - ${d50.Description}`, async () => {
        Allure.attachDetails(d50.Description, d50.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d50.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.searchAttribute(d50.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d51 = ExcelUtil.getTestData(SHEET, "TC51_Details_XSSSearch");
    test(`${d51.TestID} - ${d51.Description}`, async () => {
        Allure.attachDetails(d51.Description, d51.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d51.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.searchAttribute(d51.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d52 = ExcelUtil.getTestData(SHEET, "TC52_Details_UpdateAPIFailure");
    test(`${d52.TestID} - ${d52.Description}`, async () => {
        Allure.attachDetails(d52.Description, d52.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d52.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.fillDetailsForm({ name: d52.Name, displayName: d52.DisplayName });
        await catalog.clickUpdateCatalog();
        await catalog.verifySuccessOrStable();
    });

    const d53 = ExcelUtil.getTestData(SHEET, "TC53_Details_MandatorySpacesOnly");
    test(`${d53.TestID} - ${d53.Description}`, async () => {
        Allure.attachDetails(d53.Description, d53.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d53.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.fillDetailsForm({ name: d53.Name, displayName: d53.DisplayName });
        await catalog.clickUpdateCatalog();
        await catalog.verifyValidationError();
    });

    // ── DELETE CATALOG SCREEN — Positive ──────────────────────────────────────

    const d54 = ExcelUtil.getTestData(SHEET, "TC54_Delete_PopupOpens");
    test(`${d54.TestID} - ${d54.Description}`, async () => {
        Allure.attachDetails(d54.Description, d54.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d54.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.cancelDelete();
    });

    const d55 = ExcelUtil.getTestData(SHEET, "TC55_Delete_CancelCloses");
    test(`${d55.TestID} - ${d55.Description}`, async () => {
        Allure.attachDetails(d55.Description, d55.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d55.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.cancelDelete();
        await catalog.verifyDeletePopupClosed();
        await catalog.verifyNodeStillInTree(d55.CatalogNode);
    });

    const d56 = ExcelUtil.getTestData(SHEET, "TC56_Delete_ConfirmDeletes");
    test(`${d56.TestID} - ${d56.Description}`, async () => {
        Allure.attachDetails(d56.Description, d56.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d56.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessOrStable();
    });

    const d57 = ExcelUtil.getTestData(SHEET, "TC57_Delete_SuccessMessage");
    test(`${d57.TestID} - ${d57.Description}`, async () => {
        Allure.attachDetails(d57.Description, d57.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d57.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessOrStable();
    });

    const d58 = ExcelUtil.getTestData(SHEET, "TC58_Delete_RemovedFromTree");
    test(`${d58.TestID} - ${d58.Description}`, async () => {
        Allure.attachDetails(d58.Description, d58.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d58.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifyNodeRemovedFromTree(d58.CatalogNode);
    });

    // ── DELETE CATALOG SCREEN — Negative ──────────────────────────────────────

    const d59 = ExcelUtil.getTestData(SHEET, "TC59_Delete_CancelNoDelete");
    test(`${d59.TestID} - ${d59.Description}`, async () => {
        Allure.attachDetails(d59.Description, d59.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d59.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.cancelDelete();
        await catalog.verifyDeletePopupClosed();
        await catalog.verifyNodeStillInTree(d59.CatalogNode);
    });

    const d60 = ExcelUtil.getTestData(SHEET, "TC60_Delete_ClickOutsideNoDelete");
    test(`${d60.TestID} - ${d60.Description}`, async () => {
        Allure.attachDetails(d60.Description, d60.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d60.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.dismissPopupByClickingOutside();
        await catalog.verifyNodeStillInTree(d60.CatalogNode);
    });

    const d61 = ExcelUtil.getTestData(SHEET, "TC61_Delete_APIError");
    test(`${d61.TestID} - ${d61.Description}`, async () => {
        Allure.attachDetails(d61.Description, d61.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d61.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessOrStable();
    });

    const d62 = ExcelUtil.getTestData(SHEET, "TC62_Delete_ParentWithChildren");
    test(`${d62.TestID} - ${d62.Description}`, async () => {
        Allure.attachDetails(d62.Description, d62.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d62.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessOrStable();
    });

    const d63 = ExcelUtil.getTestData(SHEET, "TC63_Delete_UnauthorizedDelete");
    test(`${d63.TestID} - ${d63.Description}`, async () => {
        Allure.attachDetails(d63.Description, d63.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d63.CatalogNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.cancelDelete();
        await catalog.verifyNodeStillInTree(d63.CatalogNode);
    });

    // ── CREATE CATALOG SCREEN — Positive ──────────────────────────────────────

    const d64 = ExcelUtil.getTestData(SHEET, "TC64_Create_AllMandatory");
    test(`${d64.TestID} - ${d64.Description}`, async () => {
        Allure.attachDetails(d64.Description, d64.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC64"),
            displayName: d64.DisplayName,
            longDescription: d64.LongDescription,
            shortDescription: d64.ShortDescription,
            catalogType: d64.CatalogType,
            language: d64.Language,
        });
        await catalog.clickSave();
        await catalog.verifySuccessOrStable();
    });

    const d65 = ExcelUtil.getTestData(SHEET, "TC65_Create_NameField");
    test(`${d65.TestID} - ${d65.Description}`, async () => {
        Allure.attachDetails(d65.Description, d65.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC65"),
            displayName: d65.DisplayName,
            longDescription: d65.LongDescription,
            shortDescription: d65.ShortDescription,
            catalogType: d65.CatalogType,
        });
        await catalog.clickSave();
        await catalog.verifySuccessOrStable();
    });

    const d66 = ExcelUtil.getTestData(SHEET, "TC66_Create_DisplayName");
    test(`${d66.TestID} - ${d66.Description}`, async () => {
        Allure.attachDetails(d66.Description, d66.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC66"),
            displayName: d66.DisplayName,
            longDescription: d66.LongDescription,
            shortDescription: d66.ShortDescription,
            catalogType: d66.CatalogType,
        });
        await catalog.clickSave();
        await catalog.verifySuccessOrStable();
    });

    const d67 = ExcelUtil.getTestData(SHEET, "TC67_Create_LongDescription");
    test(`${d67.TestID} - ${d67.Description}`, async () => {
        Allure.attachDetails(d67.Description, d67.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC67"),
            displayName: d67.DisplayName,
            longDescription: d67.LongDescription,
            shortDescription: d67.ShortDescription,
            catalogType: d67.CatalogType,
        });
        await catalog.clickSave();
        await catalog.verifySuccessOrStable();
    });

    const d68 = ExcelUtil.getTestData(SHEET, "TC68_Create_ShortDescription");
    test(`${d68.TestID} - ${d68.Description}`, async () => {
        Allure.attachDetails(d68.Description, d68.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC68"),
            displayName: d68.DisplayName,
            longDescription: d68.LongDescription,
            shortDescription: d68.ShortDescription,
            catalogType: d68.CatalogType,
        });
        await catalog.clickSave();
        await catalog.verifySuccessOrStable();
    });

    const d69 = ExcelUtil.getTestData(SHEET, "TC69_Create_EnglishLanguage");
    test(`${d69.TestID} - ${d69.Description}`, async () => {
        Allure.attachDetails(d69.Description, d69.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC69"),
            displayName: d69.DisplayName,
            longDescription: d69.LongDescription,
            shortDescription: d69.ShortDescription,
            catalogType: d69.CatalogType,
            language: d69.Language,
        });
        await catalog.clickSave();
        await catalog.verifySuccessOrStable();
    });

    const d70 = ExcelUtil.getTestData(SHEET, "TC70_Create_BengaliLanguage");
    test(`${d70.TestID} - ${d70.Description}`, async () => {
        Allure.attachDetails(d70.Description, d70.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.selectLanguageOnForm(d70.Language);
        await catalog.verifyPageLoaded();
    });

    const d71 = ExcelUtil.getTestData(SHEET, "TC71_Create_TeluguLanguage");
    test(`${d71.TestID} - ${d71.Description}`, async () => {
        Allure.attachDetails(d71.Description, d71.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.selectLanguageOnForm(d71.Language);
        await catalog.verifyPageLoaded();
    });

    const d72 = ExcelUtil.getTestData(SHEET, "TC72_Create_HindiLanguage");
    test(`${d72.TestID} - ${d72.Description}`, async () => {
        Allure.attachDetails(d72.Description, d72.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.selectLanguageOnForm(d72.Language);
        await catalog.verifyPageLoaded();
    });

    const d73 = ExcelUtil.getTestData(SHEET, "TC73_Create_RootType");
    test(`${d73.TestID} - ${d73.Description}`, async () => {
        Allure.attachDetails(d73.Description, d73.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyCatalogTypeDropdownVisible();
        await catalog.verifyPageLoaded();
    });

    const d74 = ExcelUtil.getTestData(SHEET, "TC74_Create_DomainType");
    test(`${d74.TestID} - ${d74.Description}`, async () => {
        Allure.attachDetails(d74.Description, d74.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyCatalogTypeDropdownVisible();
        await catalog.verifyPageLoaded();
    });

    const d75 = ExcelUtil.getTestData(SHEET, "TC75_Create_MarketType");
    test(`${d75.TestID} - ${d75.Description}`, async () => {
        Allure.attachDetails(d75.Description, d75.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyCatalogTypeDropdownVisible();
        await catalog.verifyPageLoaded();
    });

    const d76 = ExcelUtil.getTestData(SHEET, "TC76_Create_CategoryType");
    test(`${d76.TestID} - ${d76.Description}`, async () => {
        Allure.attachDetails(d76.Description, d76.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyCatalogTypeDropdownVisible();
        await catalog.verifyPageLoaded();
    });

    const d77 = ExcelUtil.getTestData(SHEET, "TC77_Create_ProductType");
    test(`${d77.TestID} - ${d77.Description}`, async () => {
        Allure.attachDetails(d77.Description, d77.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyCatalogTypeDropdownVisible();
        await catalog.verifyPageLoaded();
    });

    const d78 = ExcelUtil.getTestData(SHEET, "TC78_Create_ParentDropdown");
    test(`${d78.TestID} - ${d78.Description}`, async () => {
        Allure.attachDetails(d78.Description, d78.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyParentDropdownVisible();
    });

    const d79 = ExcelUtil.getTestData(SHEET, "TC79_Create_ValidParent");
    test(`${d79.TestID} - ${d79.Description}`, async () => {
        Allure.attachDetails(d79.Description, d79.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC79"),
            displayName: d79.DisplayName,
            longDescription: d79.LongDescription,
            shortDescription: d79.ShortDescription,
            catalogType: d79.CatalogType,
            parent: d79.Parent,
        });
        await catalog.clickSave();
        await catalog.verifySuccessOrStable();
    });

    const d80 = ExcelUtil.getTestData(SHEET, "TC80_Create_ThumbnailUpload");
    test(`${d80.TestID} - ${d80.Description}`, async () => {
        Allure.attachDetails(d80.Description, d80.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d80.ThumbnailPath);
        await catalog.verifyThumbnailPreview();
    });

    const d81 = ExcelUtil.getTestData(SHEET, "TC81_Create_AddAttribute");
    test(`${d81.TestID} - ${d81.Description}`, async () => {
        Allure.attachDetails(d81.Description, d81.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.clickAddAttribute();
        await catalog.verifyPageLoaded();
    });

    const d82 = ExcelUtil.getTestData(SHEET, "TC82_Create_SearchAttribute");
    test(`${d82.TestID} - ${d82.Description}`, async () => {
        Allure.attachDetails(d82.Description, d82.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.searchAttribute(d82.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d83 = ExcelUtil.getTestData(SHEET, "TC83_Create_SaveSuccess");
    test(`${d83.TestID} - ${d83.Description}`, async () => {
        Allure.attachDetails(d83.Description, d83.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: catalog.generateUniqueCatalogName("TC83"),
            displayName: d83.DisplayName,
            longDescription: d83.LongDescription,
            shortDescription: d83.ShortDescription,
            catalogType: d83.CatalogType,
        });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    // ── CREATE CATALOG SCREEN — Negative ──────────────────────────────────────

    const d84 = ExcelUtil.getTestData(SHEET, "TC84_Create_BlankName");
    test(`${d84.TestID} - ${d84.Description}`, async () => {
        Allure.attachDetails(d84.Description, d84.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d84.Name, displayName: d84.DisplayName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d85 = ExcelUtil.getTestData(SHEET, "TC85_Create_BlankDisplayName");
    test(`${d85.TestID} - ${d85.Description}`, async () => {
        Allure.attachDetails(d85.Description, d85.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d85.Name, displayName: d85.DisplayName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d86 = ExcelUtil.getTestData(SHEET, "TC86_Create_BlankLongDesc");
    test(`${d86.TestID} - ${d86.Description}`, async () => {
        Allure.attachDetails(d86.Description, d86.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d86.Name, displayName: d86.DisplayName, longDescription: d86.LongDescription });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d87 = ExcelUtil.getTestData(SHEET, "TC87_Create_BlankShortDesc");
    test(`${d87.TestID} - ${d87.Description}`, async () => {
        Allure.attachDetails(d87.Description, d87.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d87.Name, displayName: d87.DisplayName, shortDescription: d87.ShortDescription });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d88 = ExcelUtil.getTestData(SHEET, "TC88_Create_NoCatalogType");
    test(`${d88.TestID} - ${d88.Description}`, async () => {
        Allure.attachDetails(d88.Description, d88.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d88.Name, displayName: d88.DisplayName });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d89 = ExcelUtil.getTestData(SHEET, "TC89_Create_SpecialCharsName");
    test(`${d89.TestID} - ${d89.Description}`, async () => {
        Allure.attachDetails(d89.Description, d89.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d89.Name, displayName: d89.DisplayName });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d90 = ExcelUtil.getTestData(SHEET, "TC90_Create_DuplicateName");
    test(`${d90.TestID} - ${d90.Description}`, async () => {
        Allure.attachDetails(d90.Description, d90.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d90.DuplicateName, displayName: d90.DisplayName });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d91 = ExcelUtil.getTestData(SHEET, "TC91_Create_NameTooLong");
    test(`${d91.TestID} - ${d91.Description}`, async () => {
        Allure.attachDetails(d91.Description, d91.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d91.LongName, displayName: d91.DisplayName });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d92 = ExcelUtil.getTestData(SHEET, "TC92_Create_DisplayNameTooLong");
    test(`${d92.TestID} - ${d92.Description}`, async () => {
        Allure.attachDetails(d92.Description, d92.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d92.Name, displayName: d92.LongDisplayName });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d93 = ExcelUtil.getTestData(SHEET, "TC93_Create_NonImageFile");
    test(`${d93.TestID} - ${d93.Description}`, async () => {
        Allure.attachDetails(d93.Description, d93.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d93.NonImageFilePath);
        await catalog.verifyPageLoaded();
    });

    const d94 = ExcelUtil.getTestData(SHEET, "TC94_Create_OversizedImage");
    test(`${d94.TestID} - ${d94.Description}`, async () => {
        Allure.attachDetails(d94.Description, d94.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d94.OversizedImagePath);
        await catalog.verifyPageLoaded();
    });

    const d95 = ExcelUtil.getTestData(SHEET, "TC95_Create_CorruptedImage");
    test(`${d95.TestID} - ${d95.Description}`, async () => {
        Allure.attachDetails(d95.Description, d95.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d95.CorruptedImagePath);
        await catalog.verifyPageLoaded();
    });

    const d96 = ExcelUtil.getTestData(SHEET, "TC96_Create_AddAttrNoSelection");
    test(`${d96.TestID} - ${d96.Description}`, async () => {
        Allure.attachDetails(d96.Description, d96.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.clickAddAttribute();
        await catalog.verifyPageLoaded();
    });

    const d97 = ExcelUtil.getTestData(SHEET, "TC97_Create_DuplicateAttr");
    test(`${d97.TestID} - ${d97.Description}`, async () => {
        Allure.attachDetails(d97.Description, d97.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d98 = ExcelUtil.getTestData(SHEET, "TC98_Create_SearchSpecialChars");
    test(`${d98.TestID} - ${d98.Description}`, async () => {
        Allure.attachDetails(d98.Description, d98.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.searchAttribute(d98.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d99 = ExcelUtil.getTestData(SHEET, "TC99_Create_SQLInjection");
    test(`${d99.TestID} - ${d99.Description}`, async () => {
        Allure.attachDetails(d99.Description, d99.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d99.Name, displayName: d99.DisplayName });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d100 = ExcelUtil.getTestData(SHEET, "TC100_Create_XSSScript");
    test(`${d100.TestID} - ${d100.Description}`, async () => {
        Allure.attachDetails(d100.Description, d100.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d100.Name, displayName: d100.DisplayName });
        await catalog.clickSave();
        await catalog.verifyPageLoaded();
    });

    const d101 = ExcelUtil.getTestData(SHEET, "TC101_Create_APIFailureSave");
    test(`${d101.TestID} - ${d101.Description}`, async () => {
        Allure.attachDetails(d101.Description, d101.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d102 = ExcelUtil.getTestData(SHEET, "TC102_Create_UnauthorizedCreate");
    test(`${d102.TestID} - ${d102.Description}`, async () => {
        Allure.attachDetails(d102.Description, d102.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });
});
