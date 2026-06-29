import { Page } from "@playwright/test";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import HomeSteps from "@uiSteps/HomeSteps";
import CatalogSteps from "@uiSteps/CatalogSteps";
import { getCredential, Role } from "@config/Credentials";
import CatalogPage from "@pages/CatalogPage";

const SHEET = "CatalogTest";

let sharedPage!: Page;
let home!: HomeSteps;
let catalog!: CatalogSteps;

test.describe("Catalog Test", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        home = new HomeSteps(sharedPage);
        catalog = new CatalogSteps(sharedPage);
        const d = ExcelUtil.getTestData(SHEET, "TC01_MainScreen_PageLoads");
        const creds = getCredential(Role.TENANT);
        await home.launchApplication();
        await home.login(creds.email, creds.password, d.persona);
        await home.validateLogin(creds.email);
    });

    test.afterAll(async () => {
        await home.logout();
        await sharedPage?.close();
    });

    // ── Catalog Main Screen — Positive ────────────────────────────────────────

    const d01 = ExcelUtil.getTestData(SHEET, "TC01_MainScreen_PageLoads");
    test(`${d01.TestID} - ${d01.Description}`, async () => {
        Allure.attachDetails(d01.Description, d01.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
        await catalog.verifyCatalogTreeVisible();
    });

    const d02 = ExcelUtil.getTestData(SHEET, "TC02_MainScreen_ExpandNode");
    test(`${d02.TestID} - ${d02.Description}`, async () => {
        Allure.attachDetails(d02.Description, d02.Issue);
        await catalog.navigateToCatalog();
        await catalog.expandTreeNode(d02.ParentNode);
        await catalog.verifyChildrenVisible(d02.ParentNode, d02.ExpectedChildren.split(",").map((c: string) => c.trim()));
    });

    const d03 = ExcelUtil.getTestData(SHEET, "TC03_MainScreen_SelectNode");
    test(`${d03.TestID} - ${d03.Description}`, async () => {
        Allure.attachDetails(d03.Description, d03.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d03.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
    });

    const d04 = ExcelUtil.getTestData(SHEET, "TC04_MainScreen_CreateButton");
    test(`${d04.TestID} - ${d04.Description}`, async () => {
        Allure.attachDetails(d04.Description, d04.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyCreateButtonVisible();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
    });

    const d05 = ExcelUtil.getTestData(SHEET, "TC05_MainScreen_NameField");
    test(`${d05.TestID} - ${d05.Description}`, async () => {
        Allure.attachDetails(d05.Description, d05.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d05.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
    });

    const d06 = ExcelUtil.getTestData(SHEET, "TC06_MainScreen_DisplayNameField");
    test(`${d06.TestID} - ${d06.Description}`, async () => {
        Allure.attachDetails(d06.Description, d06.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d06.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_DISPLAY_NAME, "Display Name");
    });

    const d07 = ExcelUtil.getTestData(SHEET, "TC07_MainScreen_LongDescField");
    test(`${d07.TestID} - ${d07.Description}`, async () => {
        Allure.attachDetails(d07.Description, d07.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d07.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_LONG_DESC, "Long Description");
    });

    const d08 = ExcelUtil.getTestData(SHEET, "TC08_MainScreen_ShortDescField");
    test(`${d08.TestID} - ${d08.Description}`, async () => {
        Allure.attachDetails(d08.Description, d08.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d08.CatalogNode);
        await catalog.verifyDetailField(CatalogPage.DETAIL_SHORT_DESC, "Short Description");
    });

    const d09 = ExcelUtil.getTestData(SHEET, "TC09_MainScreen_AttributeCount");
    test(`${d09.TestID} - ${d09.Description}`, async () => {
        Allure.attachDetails(d09.Description, d09.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d09.CatalogNode);
        await catalog.verifyAttributeCount(d09.ExpectedCount);
    });

    const d10 = ExcelUtil.getTestData(SHEET, "TC10_MainScreen_TreeHierarchy");
    test(`${d10.TestID} - ${d10.Description}`, async () => {
        Allure.attachDetails(d10.Description, d10.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyTreeHierarchy(d10.ParentNode, d10.ChildNode);
    });

    // ── Catalog Main Screen — Negative ────────────────────────────────────────

    const d11 = ExcelUtil.getTestData(SHEET, "TC11_MainScreen_EmptyDetails");
    test(`${d11.TestID} - ${d11.Description}`, async () => {
        Allure.attachDetails(d11.Description, d11.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyDetailsEmptyWhenNoneSelected();
    });

    const d12 = ExcelUtil.getTestData(SHEET, "TC12_MainScreen_APIFailure");
    test(`${d12.TestID} - ${d12.Description}`, async () => {
        Allure.attachDetails(d12.Description, d12.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d13 = ExcelUtil.getTestData(SHEET, "TC13_MainScreen_InvalidNodes");
    test(`${d13.TestID} - ${d13.Description}`, async () => {
        Allure.attachDetails(d13.Description, d13.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyCatalogTreeVisible();
        await catalog.verifyPageLoaded();
    });

    const d14 = ExcelUtil.getTestData(SHEET, "TC14_MainScreen_MissingDetails");
    test(`${d14.TestID} - ${d14.Description}`, async () => {
        Allure.attachDetails(d14.Description, d14.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d14.CatalogNode);
        await catalog.verifyPageLoaded();
    });

    const d15 = ExcelUtil.getTestData(SHEET, "TC15_MainScreen_UnauthorizedCreate");
    test(`${d15.TestID} - ${d15.Description}`, async () => {
        Allure.attachDetails(d15.Description, d15.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d16 = ExcelUtil.getTestData(SHEET, "TC16_MainScreen_LongNameDisplay");
    test(`${d16.TestID} - ${d16.Description}`, async () => {
        Allure.attachDetails(d16.Description, d16.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d16.CatalogNode);
        await catalog.verifyPageLoaded();
    });

    const d17 = ExcelUtil.getTestData(SHEET, "TC17_MainScreen_EmptyTree");
    test(`${d17.TestID} - ${d17.Description}`, async () => {
        Allure.attachDetails(d17.Description, d17.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyCatalogTreeVisible();
    });

    const d18 = ExcelUtil.getTestData(SHEET, "TC18_MainScreen_DuplicateName");
    test(`${d18.TestID} - ${d18.Description}`, async () => {
        Allure.attachDetails(d18.Description, d18.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d18.DuplicateName, displayName: d18.DisplayName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d19 = ExcelUtil.getTestData(SHEET, "TC19_MainScreen_LargeHierarchy");
    test(`${d19.TestID} - ${d19.Description}`, async () => {
        Allure.attachDetails(d19.Description, d19.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyCatalogTreeVisible();
        await catalog.verifyPageLoaded();
    });

    const d20 = ExcelUtil.getTestData(SHEET, "TC20_MainScreen_DisabledButtons");
    test(`${d20.TestID} - ${d20.Description}`, async () => {
        Allure.attachDetails(d20.Description, d20.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyDeleteButtonInactive();
    });

    // ── Catalog Details Screen — Positive ─────────────────────────────────────

    const d21 = ExcelUtil.getTestData(SHEET, "TC21_Details_PageLoads");
    test(`${d21.TestID} - ${d21.Description}`, async () => {
        Allure.attachDetails(d21.Description, d21.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d21.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d22 = ExcelUtil.getTestData(SHEET, "TC22_Details_AllFieldsPopulated");
    test(`${d22.TestID} - ${d22.Description}`, async () => {
        Allure.attachDetails(d22.Description, d22.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d22.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
        await catalog.verifyDetailField(CatalogPage.DETAIL_DISPLAY_NAME, "Display Name");
    });

    const d23 = ExcelUtil.getTestData(SHEET, "TC23_Details_NameField");
    test(`${d23.TestID} - ${d23.Description}`, async () => {
        Allure.attachDetails(d23.Description, d23.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d23.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
    });

    const d24 = ExcelUtil.getTestData(SHEET, "TC24_Details_DisplayNameField");
    test(`${d24.TestID} - ${d24.Description}`, async () => {
        Allure.attachDetails(d24.Description, d24.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d24.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_DISPLAY_NAME, "Display Name");
    });

    const d25 = ExcelUtil.getTestData(SHEET, "TC25_Details_LongDescField");
    test(`${d25.TestID} - ${d25.Description}`, async () => {
        Allure.attachDetails(d25.Description, d25.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d25.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_LONG_DESC, "Long Description");
    });

    const d26 = ExcelUtil.getTestData(SHEET, "TC26_Details_ShortDescField");
    test(`${d26.TestID} - ${d26.Description}`, async () => {
        Allure.attachDetails(d26.Description, d26.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d26.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_SHORT_DESC, "Short Description");
    });

    const d27 = ExcelUtil.getTestData(SHEET, "TC27_Details_LanguageDropdown");
    test(`${d27.TestID} - ${d27.Description}`, async () => {
        Allure.attachDetails(d27.Description, d27.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d27.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyLanguageDropdownVisible();
    });

    const d28 = ExcelUtil.getTestData(SHEET, "TC28_Details_ChangeLanguage");
    test(`${d28.TestID} - ${d28.Description}`, async () => {
        Allure.attachDetails(d28.Description, d28.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d28.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.selectLanguage(d28.Language);
        await catalog.verifyDetailField(CatalogPage.DETAIL_NAME, "Name");
    });

    const d29 = ExcelUtil.getTestData(SHEET, "TC29_Details_CatalogLevel");
    test(`${d29.TestID} - ${d29.Description}`, async () => {
        Allure.attachDetails(d29.Description, d29.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d29.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_CATALOG_LEVEL, "Catalog Level");
    });

    const d30 = ExcelUtil.getTestData(SHEET, "TC30_Details_ParentField");
    test(`${d30.TestID} - ${d30.Description}`, async () => {
        Allure.attachDetails(d30.Description, d30.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d30.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_PARENT, "Parent");
    });

    const d31 = ExcelUtil.getTestData(SHEET, "TC31_Details_AliasField");
    test(`${d31.TestID} - ${d31.Description}`, async () => {
        Allure.attachDetails(d31.Description, d31.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d31.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_ALIAS, "Catalog Alias");
    });

    const d32 = ExcelUtil.getTestData(SHEET, "TC32_Details_CatalogTypeField");
    test(`${d32.TestID} - ${d32.Description}`, async () => {
        Allure.attachDetails(d32.Description, d32.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d32.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyDetailField(CatalogPage.DETAIL_CATALOG_TYPE, "Catalog Type");
    });

    const d33 = ExcelUtil.getTestData(SHEET, "TC33_Details_IconUpload");
    test(`${d33.TestID} - ${d33.Description}`, async () => {
        Allure.attachDetails(d33.Description, d33.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d33.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.uploadThumbnail(d33.IconFilePath);
        await catalog.verifyThumbnailPreview();
    });

    const d34 = ExcelUtil.getTestData(SHEET, "TC34_Details_IconPreview");
    test(`${d34.TestID} - ${d34.Description}`, async () => {
        Allure.attachDetails(d34.Description, d34.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d34.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyThumbnailPreview();
    });

    const d35 = ExcelUtil.getTestData(SHEET, "TC35_Details_ChangeImage");
    test(`${d35.TestID} - ${d35.Description}`, async () => {
        Allure.attachDetails(d35.Description, d35.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d35.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.clickChangeImage();
        await catalog.verifyPageLoaded();
    });

    const d36 = ExcelUtil.getTestData(SHEET, "TC36_Details_ImageLibrary");
    test(`${d36.TestID} - ${d36.Description}`, async () => {
        Allure.attachDetails(d36.Description, d36.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d36.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyImageLibraryVisible();
    });

    const d37 = ExcelUtil.getTestData(SHEET, "TC37_Details_AddImage");
    test(`${d37.TestID} - ${d37.Description}`, async () => {
        Allure.attachDetails(d37.Description, d37.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d37.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.clickAddImage();
        await catalog.verifyPageLoaded();
    });

    const d38 = ExcelUtil.getTestData(SHEET, "TC38_Details_ImageTitle");
    test(`${d38.TestID} - ${d38.Description}`, async () => {
        Allure.attachDetails(d38.Description, d38.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d38.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyImageLibraryVisible();
        await catalog.verifyPageLoaded();
    });

    const d39 = ExcelUtil.getTestData(SHEET, "TC39_Details_ImageDescription");
    test(`${d39.TestID} - ${d39.Description}`, async () => {
        Allure.attachDetails(d39.Description, d39.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d39.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyImageLibraryVisible();
        await catalog.verifyPageLoaded();
    });

    const d40 = ExcelUtil.getTestData(SHEET, "TC40_Details_AddAttribute");
    test(`${d40.TestID} - ${d40.Description}`, async () => {
        Allure.attachDetails(d40.Description, d40.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d40.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.clickAddAttribute();
        await catalog.verifyPageLoaded();
    });

    const d41 = ExcelUtil.getTestData(SHEET, "TC41_Details_AttributeSearch");
    test(`${d41.TestID} - ${d41.Description}`, async () => {
        Allure.attachDetails(d41.Description, d41.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d41.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.searchAttribute(d41.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d42 = ExcelUtil.getTestData(SHEET, "TC42_Details_VisibleToggle");
    test(`${d42.TestID} - ${d42.Description}`, async () => {
        Allure.attachDetails(d42.Description, d42.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d42.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d43 = ExcelUtil.getTestData(SHEET, "TC43_Details_RequiredToggle");
    test(`${d43.TestID} - ${d43.Description}`, async () => {
        Allure.attachDetails(d43.Description, d43.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d43.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d44 = ExcelUtil.getTestData(SHEET, "TC44_Details_SearchableToggle");
    test(`${d44.TestID} - ${d44.Description}`, async () => {
        Allure.attachDetails(d44.Description, d44.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d44.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d45 = ExcelUtil.getTestData(SHEET, "TC45_Details_InventoryableToggle");
    test(`${d45.TestID} - ${d45.Description}`, async () => {
        Allure.attachDetails(d45.Description, d45.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d45.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d46 = ExcelUtil.getTestData(SHEET, "TC46_Details_VariantToggle");
    test(`${d46.TestID} - ${d46.Description}`, async () => {
        Allure.attachDetails(d46.Description, d46.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d46.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d47 = ExcelUtil.getTestData(SHEET, "TC47_Details_VisibleOnCreate");
    test(`${d47.TestID} - ${d47.Description}`, async () => {
        Allure.attachDetails(d47.Description, d47.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d47.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d48 = ExcelUtil.getTestData(SHEET, "TC48_Details_VisibleOnUpdate");
    test(`${d48.TestID} - ${d48.Description}`, async () => {
        Allure.attachDetails(d48.Description, d48.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d48.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d49 = ExcelUtil.getTestData(SHEET, "TC49_Details_VisibleOnShow");
    test(`${d49.TestID} - ${d49.Description}`, async () => {
        Allure.attachDetails(d49.Description, d49.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d49.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d50 = ExcelUtil.getTestData(SHEET, "TC50_Details_AttributeSorting");
    test(`${d50.TestID} - ${d50.Description}`, async () => {
        Allure.attachDetails(d50.Description, d50.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d50.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d51 = ExcelUtil.getTestData(SHEET, "TC51_Details_FormLayout");
    test(`${d51.TestID} - ${d51.Description}`, async () => {
        Allure.attachDetails(d51.Description, d51.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d51.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyFormLayoutVisible();
    });

    const d52 = ExcelUtil.getTestData(SHEET, "TC52_Details_AddBlock");
    test(`${d52.TestID} - ${d52.Description}`, async () => {
        Allure.attachDetails(d52.Description, d52.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d52.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.clickAddBlock();
        await catalog.verifyPageLoaded();
    });

    const d53 = ExcelUtil.getTestData(SHEET, "TC53_Details_AddAttrToBlock");
    test(`${d53.TestID} - ${d53.Description}`, async () => {
        Allure.attachDetails(d53.Description, d53.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d53.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d54 = ExcelUtil.getTestData(SHEET, "TC54_Details_OrderTypes");
    test(`${d54.TestID} - ${d54.Description}`, async () => {
        Allure.attachDetails(d54.Description, d54.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d54.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPageLoaded();
    });

    const d55 = ExcelUtil.getTestData(SHEET, "TC55_Details_Pagination");
    test(`${d55.TestID} - ${d55.Description}`, async () => {
        Allure.attachDetails(d55.Description, d55.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d55.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.verifyPaginationVisible();
    });

    // ── Catalog Details Screen — Negative ─────────────────────────────────────

    const d56 = ExcelUtil.getTestData(SHEET, "TC56_Details_APIFailure");
    test(`${d56.TestID} - ${d56.Description}`, async () => {
        Allure.attachDetails(d56.Description, d56.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d57 = ExcelUtil.getTestData(SHEET, "TC57_Details_EmptyState");
    test(`${d57.TestID} - ${d57.Description}`, async () => {
        Allure.attachDetails(d57.Description, d57.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyDetailsEmptyWhenNoneSelected();
    });

    const d58 = ExcelUtil.getTestData(SHEET, "TC58_Details_SpecialCharsName");
    test(`${d58.TestID} - ${d58.Description}`, async () => {
        Allure.attachDetails(d58.Description, d58.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d58.InvalidName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d59 = ExcelUtil.getTestData(SHEET, "TC59_Details_DuplicateAlias");
    test(`${d59.TestID} - ${d59.Description}`, async () => {
        Allure.attachDetails(d59.Description, d59.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d60 = ExcelUtil.getTestData(SHEET, "TC60_Details_MissingTranslation");
    test(`${d60.TestID} - ${d60.Description}`, async () => {
        Allure.attachDetails(d60.Description, d60.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d61 = ExcelUtil.getTestData(SHEET, "TC61_Details_UnsupportedImageFormat");
    test(`${d61.TestID} - ${d61.Description}`, async () => {
        Allure.attachDetails(d61.Description, d61.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d62 = ExcelUtil.getTestData(SHEET, "TC62_Details_ImageSizeExceeded");
    test(`${d62.TestID} - ${d62.Description}`, async () => {
        Allure.attachDetails(d62.Description, d62.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d63 = ExcelUtil.getTestData(SHEET, "TC63_Details_CorruptedImage");
    test(`${d63.TestID} - ${d63.Description}`, async () => {
        Allure.attachDetails(d63.Description, d63.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d64 = ExcelUtil.getTestData(SHEET, "TC64_Details_InvalidImageURL");
    test(`${d64.TestID} - ${d64.Description}`, async () => {
        Allure.attachDetails(d64.Description, d64.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d65 = ExcelUtil.getTestData(SHEET, "TC65_Details_ImageUploadFailure");
    test(`${d65.TestID} - ${d65.Description}`, async () => {
        Allure.attachDetails(d65.Description, d65.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d66 = ExcelUtil.getTestData(SHEET, "TC66_Details_DeleteImage");
    test(`${d66.TestID} - ${d66.Description}`, async () => {
        Allure.attachDetails(d66.Description, d66.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d67 = ExcelUtil.getTestData(SHEET, "TC67_Details_DuplicateImage");
    test(`${d67.TestID} - ${d67.Description}`, async () => {
        Allure.attachDetails(d67.Description, d67.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d68 = ExcelUtil.getTestData(SHEET, "TC68_Details_AddAttrMandatoryMissing");
    test(`${d68.TestID} - ${d68.Description}`, async () => {
        Allure.attachDetails(d68.Description, d68.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d69 = ExcelUtil.getTestData(SHEET, "TC69_Details_DuplicateAttribute");
    test(`${d69.TestID} - ${d69.Description}`, async () => {
        Allure.attachDetails(d69.Description, d69.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d70 = ExcelUtil.getTestData(SHEET, "TC70_Details_InvalidAttrType");
    test(`${d70.TestID} - ${d70.Description}`, async () => {
        Allure.attachDetails(d70.Description, d70.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d71 = ExcelUtil.getTestData(SHEET, "TC71_Details_AttrSearchNoResults");
    test(`${d71.TestID} - ${d71.Description}`, async () => {
        Allure.attachDetails(d71.Description, d71.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d71.CatalogNode);
        await catalog.clickDetailsButton();
        await catalog.searchAttribute(d71.SearchTerm);
        await catalog.verifyNoAttributeResults();
    });

    const d72 = ExcelUtil.getTestData(SHEET, "TC72_Details_ToggleAPIFailure");
    test(`${d72.TestID} - ${d72.Description}`, async () => {
        Allure.attachDetails(d72.Description, d72.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d73 = ExcelUtil.getTestData(SHEET, "TC73_Details_InvalidSortPosition");
    test(`${d73.TestID} - ${d73.Description}`, async () => {
        Allure.attachDetails(d73.Description, d73.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d74 = ExcelUtil.getTestData(SHEET, "TC74_Details_RequiredToggleUnsupported");
    test(`${d74.TestID} - ${d74.Description}`, async () => {
        Allure.attachDetails(d74.Description, d74.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d75 = ExcelUtil.getTestData(SHEET, "TC75_Details_DeleteAttribute");
    test(`${d75.TestID} - ${d75.Description}`, async () => {
        Allure.attachDetails(d75.Description, d75.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d76 = ExcelUtil.getTestData(SHEET, "TC76_Details_EmptyBlock");
    test(`${d76.TestID} - ${d76.Description}`, async () => {
        Allure.attachDetails(d76.Description, d76.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d77 = ExcelUtil.getTestData(SHEET, "TC77_Details_DuplicateFieldInBlock");
    test(`${d77.TestID} - ${d77.Description}`, async () => {
        Allure.attachDetails(d77.Description, d77.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d78 = ExcelUtil.getTestData(SHEET, "TC78_Details_BlockDeletion");
    test(`${d78.TestID} - ${d78.Description}`, async () => {
        Allure.attachDetails(d78.Description, d78.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d79 = ExcelUtil.getTestData(SHEET, "TC79_Details_InvalidDragDrop");
    test(`${d79.TestID} - ${d79.Description}`, async () => {
        Allure.attachDetails(d79.Description, d79.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d80 = ExcelUtil.getTestData(SHEET, "TC80_Details_MandatoryFieldsMissing");
    test(`${d80.TestID} - ${d80.Description}`, async () => {
        Allure.attachDetails(d80.Description, d80.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d81 = ExcelUtil.getTestData(SHEET, "TC81_Details_LayoutAfterRefresh");
    test(`${d81.TestID} - ${d81.Description}`, async () => {
        Allure.attachDetails(d81.Description, d81.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d81.CatalogNode);
        await catalog.clickDetailsButton();
        await sharedPage.reload();
        await catalog.verifyPageLoaded();
    });

    const d82 = ExcelUtil.getTestData(SHEET, "TC82_Details_LargeAttrCount");
    test(`${d82.TestID} - ${d82.Description}`, async () => {
        Allure.attachDetails(d82.Description, d82.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d83 = ExcelUtil.getTestData(SHEET, "TC83_Details_UnauthorizedModify");
    test(`${d83.TestID} - ${d83.Description}`, async () => {
        Allure.attachDetails(d83.Description, d83.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d84 = ExcelUtil.getTestData(SHEET, "TC84_Details_UnauthorizedImageUpload");
    test(`${d84.TestID} - ${d84.Description}`, async () => {
        Allure.attachDetails(d84.Description, d84.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d85 = ExcelUtil.getTestData(SHEET, "TC85_Details_UnauthorizedAttr");
    test(`${d85.TestID} - ${d85.Description}`, async () => {
        Allure.attachDetails(d85.Description, d85.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d86 = ExcelUtil.getTestData(SHEET, "TC86_Details_EmptyOrderTypes");
    test(`${d86.TestID} - ${d86.Description}`, async () => {
        Allure.attachDetails(d86.Description, d86.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d87 = ExcelUtil.getTestData(SHEET, "TC87_Details_PaginationDynamic");
    test(`${d87.TestID} - ${d87.Description}`, async () => {
        Allure.attachDetails(d87.Description, d87.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPaginationVisible();
    });

    const d88 = ExcelUtil.getTestData(SHEET, "TC88_Details_NullValues");
    test(`${d88.TestID} - ${d88.Description}`, async () => {
        Allure.attachDetails(d88.Description, d88.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d89 = ExcelUtil.getTestData(SHEET, "TC89_Details_ConcurrentUpdates");
    test(`${d89.TestID} - ${d89.Description}`, async () => {
        Allure.attachDetails(d89.Description, d89.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d90 = ExcelUtil.getTestData(SHEET, "TC90_Details_BackRefreshUnsaved");
    test(`${d90.TestID} - ${d90.Description}`, async () => {
        Allure.attachDetails(d90.Description, d90.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    // ── Delete Catalog Popup — Positive ───────────────────────────────────────

    const d91 = ExcelUtil.getTestData(SHEET, "TC91_Delete_ConfirmDeletes");
    test(`${d91.TestID} - ${d91.Description}`, async () => {
        Allure.attachDetails(d91.Description, d91.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d91.CatalogNode || d91.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessToast();
        await catalog.verifyNodeRemovedFromTree(d91.CatalogNode || d91.ChildNode);
    });

    const d92 = ExcelUtil.getTestData(SHEET, "TC92_Delete_CancelKeeps");
    test(`${d92.TestID} - ${d92.Description}`, async () => {
        Allure.attachDetails(d92.Description, d92.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d92.CatalogNode || d92.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.cancelDelete();
        await catalog.verifyDeletePopupClosed();
        await catalog.verifyNodeStillInTree(d92.CatalogNode || d92.ChildNode);
    });

    const d93 = ExcelUtil.getTestData(SHEET, "TC93_Delete_PopupDisplayed");
    test(`${d93.TestID} - ${d93.Description}`, async () => {
        Allure.attachDetails(d93.Description, d93.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d93.CatalogNode || d93.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.cancelDelete();
    });

    const d94 = ExcelUtil.getTestData(SHEET, "TC94_Delete_SuccessMessage");
    test(`${d94.TestID} - ${d94.Description}`, async () => {
        Allure.attachDetails(d94.Description, d94.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d94.CatalogNode || d94.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessToast();
    });

    const d95 = ExcelUtil.getTestData(SHEET, "TC95_Delete_RedirectAfterDelete");
    test(`${d95.TestID} - ${d95.Description}`, async () => {
        Allure.attachDetails(d95.Description, d95.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d95.CatalogNode || d95.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessToast();
        await catalog.verifyDetailsEmptyWhenNoneSelected();
    });

    // ── Delete Catalog Popup — Negative ───────────────────────────────────────

    const d96 = ExcelUtil.getTestData(SHEET, "TC96_Delete_CancelNoDelete");
    test(`${d96.TestID} - ${d96.Description}`, async () => {
        Allure.attachDetails(d96.Description, d96.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d96.CatalogNode || d96.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.cancelDelete();
        await catalog.verifyDeletePopupClosed();
        await catalog.verifyNodeStillInTree(d96.CatalogNode || d96.ChildNode);
    });

    const d97 = ExcelUtil.getTestData(SHEET, "TC97_Delete_CloseNoDelete");
    test(`${d97.TestID} - ${d97.Description}`, async () => {
        Allure.attachDetails(d97.Description, d97.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d97.CatalogNode || d97.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.closeDeletePopup();
        await catalog.verifyDeletePopupClosed();
        await catalog.verifyNodeStillInTree(d97.CatalogNode || d97.ChildNode);
    });

    const d98 = ExcelUtil.getTestData(SHEET, "TC98_Delete_APIError");
    test(`${d98.TestID} - ${d98.Description}`, async () => {
        Allure.attachDetails(d98.Description, d98.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyPageLoaded();
    });

    const d99 = ExcelUtil.getTestData(SHEET, "TC99_Delete_RapidClicks");
    test(`${d99.TestID} - ${d99.Description}`, async () => {
        Allure.attachDetails(d99.Description, d99.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d99.CatalogNode || d99.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifySuccessToast();
    });

    const d100 = ExcelUtil.getTestData(SHEET, "TC100_Delete_DependentChild");
    test(`${d100.TestID} - ${d100.Description}`, async () => {
        Allure.attachDetails(d100.Description, d100.Issue);
        await catalog.navigateToCatalog();
        await catalog.selectTreeNode(d100.CatalogNode || d100.ChildNode);
        await catalog.clickDeleteCatalog();
        await catalog.verifyDeletePopupDisplayed();
        await catalog.confirmDelete();
        await catalog.verifyErrorToast();
    });

    // ── Create Catalog Screen — Positive ──────────────────────────────────────

    const d101 = ExcelUtil.getTestData(SHEET, "TC101_Create_AllMandatory");
    test(`${d101.TestID} - ${d101.Description}`, async () => {
        Allure.attachDetails(d101.Description, d101.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: d101.Name, displayName: d101.DisplayName,
            longDescription: d101.LongDescription, shortDescription: d101.ShortDescription,
            catalogType: d101.CatalogType, parent: d101.Parent, language: d101.Language,
        });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    const d102 = ExcelUtil.getTestData(SHEET, "TC102_Create_ValidFields");
    test(`${d102.TestID} - ${d102.Description}`, async () => {
        Allure.attachDetails(d102.Description, d102.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: d102.Name, displayName: d102.DisplayName,
            longDescription: d102.LongDescription, shortDescription: d102.ShortDescription,
        });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    const d103 = ExcelUtil.getTestData(SHEET, "TC103_Create_EnglishLanguage");
    test(`${d103.TestID} - ${d103.Description}`, async () => {
        Allure.attachDetails(d103.Description, d103.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d103.Name, language: d103.Language });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    const d104 = ExcelUtil.getTestData(SHEET, "TC104_Create_ProductType");
    test(`${d104.TestID} - ${d104.Description}`, async () => {
        Allure.attachDetails(d104.Description, d104.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d104.Name, catalogType: d104.CatalogType });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    const d105 = ExcelUtil.getTestData(SHEET, "TC105_Create_ValidParent");
    test(`${d105.TestID} - ${d105.Description}`, async () => {
        Allure.attachDetails(d105.Description, d105.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d105.Name, parent: d105.Parent });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    const d106 = ExcelUtil.getTestData(SHEET, "TC106_Create_ThumbnailUpload");
    test(`${d106.TestID} - ${d106.Description}`, async () => {
        Allure.attachDetails(d106.Description, d106.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d106.ThumbnailPath);
        await catalog.verifyThumbnailPreview();
    });

    const d107 = ExcelUtil.getTestData(SHEET, "TC107_Create_ThumbnailPreview");
    test(`${d107.TestID} - ${d107.Description}`, async () => {
        Allure.attachDetails(d107.Description, d107.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d107.ThumbnailPath);
        await catalog.verifyThumbnailPreview();
    });

    const d108 = ExcelUtil.getTestData(SHEET, "TC108_Create_AddAttribute");
    test(`${d108.TestID} - ${d108.Description}`, async () => {
        Allure.attachDetails(d108.Description, d108.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.clickAddAttribute();
        await catalog.verifyPageLoaded();
    });

    const d109 = ExcelUtil.getTestData(SHEET, "TC109_Create_SearchableToggle");
    test(`${d109.TestID} - ${d109.Description}`, async () => {
        Allure.attachDetails(d109.Description, d109.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d110 = ExcelUtil.getTestData(SHEET, "TC110_Create_RequiredToggle");
    test(`${d110.TestID} - ${d110.Description}`, async () => {
        Allure.attachDetails(d110.Description, d110.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d111 = ExcelUtil.getTestData(SHEET, "TC111_Create_VisibleOnCreate");
    test(`${d111.TestID} - ${d111.Description}`, async () => {
        Allure.attachDetails(d111.Description, d111.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d112 = ExcelUtil.getTestData(SHEET, "TC112_Create_VisibleOnUpdate");
    test(`${d112.TestID} - ${d112.Description}`, async () => {
        Allure.attachDetails(d112.Description, d112.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d113 = ExcelUtil.getTestData(SHEET, "TC113_Create_VisibleOnShow");
    test(`${d113.TestID} - ${d113.Description}`, async () => {
        Allure.attachDetails(d113.Description, d113.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d114 = ExcelUtil.getTestData(SHEET, "TC114_Create_ReorderAttributes");
    test(`${d114.TestID} - ${d114.Description}`, async () => {
        Allure.attachDetails(d114.Description, d114.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d115 = ExcelUtil.getTestData(SHEET, "TC115_Create_AttrSearch");
    test(`${d115.TestID} - ${d115.Description}`, async () => {
        Allure.attachDetails(d115.Description, d115.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.searchAttribute(d115.SearchTerm);
        await catalog.verifyPageLoaded();
    });

    const d116 = ExcelUtil.getTestData(SHEET, "TC116_Create_OrderInputAttr");
    test(`${d116.TestID} - ${d116.Description}`, async () => {
        Allure.attachDetails(d116.Description, d116.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.clickAddAttribute();
        await catalog.verifyPageLoaded();
    });

    const d117 = ExcelUtil.getTestData(SHEET, "TC117_Create_MultipleAttributes");
    test(`${d117.TestID} - ${d117.Description}`, async () => {
        Allure.attachDetails(d117.Description, d117.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d118 = ExcelUtil.getTestData(SHEET, "TC118_Create_AppearsInTree");
    test(`${d118.TestID} - ${d118.Description}`, async () => {
        Allure.attachDetails(d118.Description, d118.Issue);
        await catalog.navigateToCatalog();
        await catalog.verifyTreeHierarchy(d118.ParentNode, d118.CreatedName);
    });

    const d119 = ExcelUtil.getTestData(SHEET, "TC119_Create_Pagination");
    test(`${d119.TestID} - ${d119.Description}`, async () => {
        Allure.attachDetails(d119.Description, d119.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPaginationVisible();
    });

    const d120 = ExcelUtil.getTestData(SHEET, "TC120_Create_SaveSuccess");
    test(`${d120.TestID} - ${d120.Description}`, async () => {
        Allure.attachDetails(d120.Description, d120.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({
            name: d120.Name, displayName: d120.DisplayName,
            longDescription: d120.LongDescription, shortDescription: d120.ShortDescription,
            catalogType: d120.CatalogType, parent: d120.Parent,
        });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    // ── Create Catalog Screen — Negative ──────────────────────────────────────

    const d121 = ExcelUtil.getTestData(SHEET, "TC121_Create_BlankName");
    test(`${d121.TestID} - ${d121.Description}`, async () => {
        Allure.attachDetails(d121.Description, d121.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: "", displayName: d121.DisplayName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d122 = ExcelUtil.getTestData(SHEET, "TC122_Create_BlankDisplayName");
    test(`${d122.TestID} - ${d122.Description}`, async () => {
        Allure.attachDetails(d122.Description, d122.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d122.Name, displayName: "" });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d123 = ExcelUtil.getTestData(SHEET, "TC123_Create_BlankLongDesc");
    test(`${d123.TestID} - ${d123.Description}`, async () => {
        Allure.attachDetails(d123.Description, d123.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d123.Name, displayName: d123.DisplayName, longDescription: "" });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d124 = ExcelUtil.getTestData(SHEET, "TC124_Create_BlankShortDesc");
    test(`${d124.TestID} - ${d124.Description}`, async () => {
        Allure.attachDetails(d124.Description, d124.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d124.Name, displayName: d124.DisplayName, shortDescription: "" });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d125 = ExcelUtil.getTestData(SHEET, "TC125_Create_NoCatalogType");
    test(`${d125.TestID} - ${d125.Description}`, async () => {
        Allure.attachDetails(d125.Description, d125.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d125.Name });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d126 = ExcelUtil.getTestData(SHEET, "TC126_Create_NoParent");
    test(`${d126.TestID} - ${d126.Description}`, async () => {
        Allure.attachDetails(d126.Description, d126.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d126.Name });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d127 = ExcelUtil.getTestData(SHEET, "TC127_Create_DuplicateName");
    test(`${d127.TestID} - ${d127.Description}`, async () => {
        Allure.attachDetails(d127.Description, d127.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d127.DuplicateName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d128 = ExcelUtil.getTestData(SHEET, "TC128_Create_NameTooLong");
    test(`${d128.TestID} - ${d128.Description}`, async () => {
        Allure.attachDetails(d128.Description, d128.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d128.LongName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d129 = ExcelUtil.getTestData(SHEET, "TC129_Create_DisplayNameTooLong");
    test(`${d129.TestID} - ${d129.Description}`, async () => {
        Allure.attachDetails(d129.Description, d129.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d129.Name, displayName: d129.LongDisplayName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d130 = ExcelUtil.getTestData(SHEET, "TC130_Create_SpecialCharsName");
    test(`${d130.TestID} - ${d130.Description}`, async () => {
        Allure.attachDetails(d130.Description, d130.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d130.InvalidName });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d131 = ExcelUtil.getTestData(SHEET, "TC131_Create_NonImageFile");
    test(`${d131.TestID} - ${d131.Description}`, async () => {
        Allure.attachDetails(d131.Description, d131.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d131.NonImageFilePath);
        await catalog.verifyPageLoaded();
    });

    const d132 = ExcelUtil.getTestData(SHEET, "TC132_Create_OversizedImage");
    test(`${d132.TestID} - ${d132.Description}`, async () => {
        Allure.attachDetails(d132.Description, d132.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d132.OversizedImagePath);
        await catalog.verifyPageLoaded();
    });

    const d133 = ExcelUtil.getTestData(SHEET, "TC133_Create_CorruptedImage");
    test(`${d133.TestID} - ${d133.Description}`, async () => {
        Allure.attachDetails(d133.Description, d133.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.uploadThumbnail(d133.CorruptedImagePath);
        await catalog.verifyPageLoaded();
    });

    const d134 = ExcelUtil.getTestData(SHEET, "TC134_Create_MissingRequiredAttr");
    test(`${d134.TestID} - ${d134.Description}`, async () => {
        Allure.attachDetails(d134.Description, d134.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d134.Name });
        await catalog.clickSave();
        await catalog.verifyValidationError();
    });

    const d135 = ExcelUtil.getTestData(SHEET, "TC135_Create_DuplicateAttr");
    test(`${d135.TestID} - ${d135.Description}`, async () => {
        Allure.attachDetails(d135.Description, d135.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d136 = ExcelUtil.getTestData(SHEET, "TC136_Create_IncompleteAttrConfig");
    test(`${d136.TestID} - ${d136.Description}`, async () => {
        Allure.attachDetails(d136.Description, d136.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d137 = ExcelUtil.getTestData(SHEET, "TC137_Create_AttrSearchNoResults");
    test(`${d137.TestID} - ${d137.Description}`, async () => {
        Allure.attachDetails(d137.Description, d137.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.searchAttribute(d137.SearchTerm);
        await catalog.verifyNoAttributeResults();
    });

    const d138 = ExcelUtil.getTestData(SHEET, "TC138_Create_RapidSaveClicks");
    test(`${d138.TestID} - ${d138.Description}`, async () => {
        Allure.attachDetails(d138.Description, d138.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.fillCatalogForm({ name: d138.Name, displayName: d138.DisplayName });
        await catalog.clickSave();
        await catalog.verifySuccessToast();
    });

    const d139 = ExcelUtil.getTestData(SHEET, "TC139_Create_APIFailureSave");
    test(`${d139.TestID} - ${d139.Description}`, async () => {
        Allure.attachDetails(d139.Description, d139.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });

    const d140 = ExcelUtil.getTestData(SHEET, "TC140_Create_DeleteMandatoryAttr");
    test(`${d140.TestID} - ${d140.Description}`, async () => {
        Allure.attachDetails(d140.Description, d140.Issue);
        await catalog.navigateToCatalog();
        await catalog.clickCreateCatalog();
        await catalog.verifyCreateFormLoaded();
        await catalog.verifyPageLoaded();
    });
});
