import { Page } from "@playwright/test";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import HomeSteps from "@uiSteps/HomeSteps";
import ItemSteps from "@uiSteps/ItemSteps";
import ItemPage from "@pages/ItemPage";
import { getCredential, Role } from "@config/Credentials";

const SHEET = "ItemTest";

let sharedPage!: Page;
let home!: HomeSteps;
let item!: ItemSteps;

test.describe("Item Test", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        home = new HomeSteps(sharedPage);
        item = new ItemSteps(sharedPage);

        const creds = getCredential(Role.SELLER);
        // persona comes from the LoginTest TC04 row so it matches the login screen role button
        const loginRow = ExcelUtil.getTestData("LoginTest", "TC04_ValidSellerLogin");
        await home.launchApplication();
        await home.login(creds.email, creds.password, loginRow.persona);
        await home.validateLogin(creds.email);
    });

    test.afterAll(async () => {
        await home.logout().catch(() => {});
        await sharedPage?.close();
    });

    // ── Item Listing Screen — Positive ────────────────────────────────────────

    const d01 = ExcelUtil.getTestData(SHEET, "TC01_List_PageLoads");
    test(`${d01.TestID} - ${d01.Description}`, async () => {
        Allure.attachDetails(d01.Description, d01.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
        await item.verifyMarketFilterVisible();
        await item.verifyCategoryFilterVisible();
        await item.verifyProductCatalogFilterVisible();
        await item.selectMarket(d01.Market);
        await item.selectCategory(d01.Category);
        await item.selectProductCatalog(d01.ProductCatalog);
        await item.verifyTableOrEmptyStateVisible();
    });

    const d02 = ExcelUtil.getTestData(SHEET, "TC02_List_SearchExistingItem");
    test(`${d02.TestID} - ${d02.Description}`, async () => {
        Allure.attachDetails(d02.Description, d02.Issue);
        await item.navigateToItems();
        await item.searchItem(d02.SearchTerm);
        await item.verifySearchResultsContain(d02.SearchTerm);
    });

    const d03 = ExcelUtil.getTestData(SHEET, "TC03_List_FilterByMarket");
    test(`${d03.TestID} - ${d03.Description}`, async () => {
        Allure.attachDetails(d03.Description, d03.Issue);
        await item.navigateToItems();
        await item.selectMarket(d03.Market);
        await item.verifyTableOrEmptyStateVisible();
    });

    const d04 = ExcelUtil.getTestData(SHEET, "TC04_List_FilterByCategory");
    test(`${d04.TestID} - ${d04.Description}`, async () => {
        Allure.attachDetails(d04.Description, d04.Issue);
        await item.navigateToItems();
        await item.selectCategory(d04.Category);
        await item.verifyTableOrEmptyStateVisible();
    });

    const d05 = ExcelUtil.getTestData(SHEET, "TC05_List_FilterByProductCatalog");
    test(`${d05.TestID} - ${d05.Description}`, async () => {
        Allure.attachDetails(d05.Description, d05.Issue);
        await item.navigateToItems();
        await item.selectProductCatalog(d05.ProductCatalog);
        await item.verifyTableOrEmptyStateVisible();
    });

    const d06 = ExcelUtil.getTestData(SHEET, "TC06_List_ClearFilters");
    test(`${d06.TestID} - ${d06.Description}`, async () => {
        Allure.attachDetails(d06.Description, d06.Issue);
        await item.navigateToItems();
        await item.selectMarket(d06.Market);
        await item.clearFilters();
        await item.verifyMarketFilterReset();
    });

    const d07 = ExcelUtil.getTestData(SHEET, "TC07_List_NavigateCreate");
    test(`${d07.TestID} - ${d07.Description}`, async () => {
        Allure.attachDetails(d07.Description, d07.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
    });

    const d08 = ExcelUtil.getTestData(SHEET, "TC08_List_NavigateBulkCreate");
    test(`${d08.TestID} - ${d08.Description}`, async () => {
        Allure.attachDetails(d08.Description, d08.Issue);
        await item.navigateToItems();
        await item.clickBulkCreate();
        await item.verifyBulkCreatePageLoaded();
    });

    const d09 = ExcelUtil.getTestData(SHEET, "TC09_List_ViewItemDetails");
    test(`${d09.TestID} - ${d09.Description}`, async () => {
        Allure.attachDetails(d09.Description, d09.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
    });

    const d10 = ExcelUtil.getTestData(SHEET, "TC10_List_ToggleStatus");
    test(`${d10.TestID} - ${d10.Description}`, async () => {
        Allure.attachDetails(d10.Description, d10.Issue);
        await item.navigateToItems();
        await item.toggleStatusOnFirstRow();
        await item.verifyStatusToggleResponse();
    });

    // ── Item Listing Screen — Negative ────────────────────────────────────────

    const d11 = ExcelUtil.getTestData(SHEET, "TC11_List_SearchNonExisting");
    test(`${d11.TestID} - ${d11.Description}`, async () => {
        Allure.attachDetails(d11.Description, d11.Issue);
        await item.navigateToItems();
        await item.searchItem(d11.SearchTerm);
        await item.verifyNoRecordsMessage();
    });

    const d12 = ExcelUtil.getTestData(SHEET, "TC12_List_SearchSpecialChars");
    test(`${d12.TestID} - ${d12.Description}`, async () => {
        Allure.attachDetails(d12.Description, d12.Issue);
        await item.navigateToItems();
        await item.searchItem(d12.SearchTerm);
        await item.verifyPageDoesNotCrash();
    });

    const d13 = ExcelUtil.getTestData(SHEET, "TC13_List_InvalidFilterCombo");
    test(`${d13.TestID} - ${d13.Description}`, async () => {
        Allure.attachDetails(d13.Description, d13.Issue);
        await item.navigateToItems();
        await item.selectMarket(d13.Market);
        await item.selectCategory(d13.Category);
        await item.verifyTableOrEmptyStateVisible();
    });

    const d14 = ExcelUtil.getTestData(SHEET, "TC14_List_UnauthorizedCreate");
    test(`${d14.TestID} - ${d14.Description}`, async () => {
        Allure.attachDetails(d14.Description, d14.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d15 = ExcelUtil.getTestData(SHEET, "TC15_List_UnauthorizedEdit");
    test(`${d15.TestID} - ${d15.Description}`, async () => {
        Allure.attachDetails(d15.Description, d15.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d16 = ExcelUtil.getTestData(SHEET, "TC16_List_UnauthorizedDelete");
    test(`${d16.TestID} - ${d16.Description}`, async () => {
        Allure.attachDetails(d16.Description, d16.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d17 = ExcelUtil.getTestData(SHEET, "TC17_List_ToggleAPIError");
    test(`${d17.TestID} - ${d17.Description}`, async () => {
        Allure.attachDetails(d17.Description, d17.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d18 = ExcelUtil.getTestData(SHEET, "TC18_List_BlankSearch");
    test(`${d18.TestID} - ${d18.Description}`, async () => {
        Allure.attachDetails(d18.Description, d18.Issue);
        await item.navigateToItems();
        await item.searchItem(d18.SearchTerm);
        await item.verifyTableOrEmptyStateVisible();
    });

    const d19 = ExcelUtil.getTestData(SHEET, "TC19_List_APITimeout");
    test(`${d19.TestID} - ${d19.Description}`, async () => {
        Allure.attachDetails(d19.Description, d19.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d20 = ExcelUtil.getTestData(SHEET, "TC20_List_RefreshUnavailable");
    test(`${d20.TestID} - ${d20.Description}`, async () => {
        Allure.attachDetails(d20.Description, d20.Issue);
        await item.navigateToItems();
        await item.clickRefreshButton();
        await item.verifyPageDoesNotCrash();
    });

    // ── View Item Details Screen — Positive ───────────────────────────────────

    const d21 = ExcelUtil.getTestData(SHEET, "TC21_View_PageLoads");
    test(`${d21.TestID} - ${d21.Description}`, async () => {
        Allure.attachDetails(d21.Description, d21.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyAllSavedInfoVisible();
    });

    const d22 = ExcelUtil.getTestData(SHEET, "TC22_View_OrgDetails");
    test(`${d22.TestID} - ${d22.Description}`, async () => {
        Allure.attachDetails(d22.Description, d22.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyOrgDetailLabelsPresent();
    });

    const d23 = ExcelUtil.getTestData(SHEET, "TC23_View_PricingSection");
    test(`${d23.TestID} - ${d23.Description}`, async () => {
        Allure.attachDetails(d23.Description, d23.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyPricingLabelsPresent();
    });

    const d24 = ExcelUtil.getTestData(SHEET, "TC24_View_ProductTypeFields");
    test(`${d24.TestID} - ${d24.Description}`, async () => {
        Allure.attachDetails(d24.Description, d24.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyProductTypeFieldsPresent();
    });

    const d25 = ExcelUtil.getTestData(SHEET, "TC25_View_InventoryDetails");
    test(`${d25.TestID} - ${d25.Description}`, async () => {
        Allure.attachDetails(d25.Description, d25.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyInventoryLabelsPresent();
    });

    const d26 = ExcelUtil.getTestData(SHEET, "TC26_View_MediaFiles");
    test(`${d26.TestID} - ${d26.Description}`, async () => {
        Allure.attachDetails(d26.Description, d26.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyMediaSectionPresent();
    });

    const d27 = ExcelUtil.getTestData(SHEET, "TC27_View_AddressSection");
    test(`${d27.TestID} - ${d27.Description}`, async () => {
        Allure.attachDetails(d27.Description, d27.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyAddressLabelsPresent();
    });

    const d28 = ExcelUtil.getTestData(SHEET, "TC28_View_AvailabilityStatus");
    test(`${d28.TestID} - ${d28.Description}`, async () => {
        Allure.attachDetails(d28.Description, d28.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyAvailabilityLabelPresent();
    });

    const d29 = ExcelUtil.getTestData(SHEET, "TC29_View_TaxCodeBrand");
    test(`${d29.TestID} - ${d29.Description}`, async () => {
        Allure.attachDetails(d29.Description, d29.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyTaxCodeOrBrandPresent();
    });

    const d30 = ExcelUtil.getTestData(SHEET, "TC30_View_BackButton");
    test(`${d30.TestID} - ${d30.Description}`, async () => {
        Allure.attachDetails(d30.Description, d30.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.clickBackToList();
        await item.verifyPageHeadingVisible();
    });

    // ── View Item Details Screen — Negative ───────────────────────────────────

    const d31 = ExcelUtil.getTestData(SHEET, "TC31_View_MissingMandatoryDetail");
    test(`${d31.TestID} - ${d31.Description}`, async () => {
        Allure.attachDetails(d31.Description, d31.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d32 = ExcelUtil.getTestData(SHEET, "TC32_View_MissingMediaFiles");
    test(`${d32.TestID} - ${d32.Description}`, async () => {
        Allure.attachDetails(d32.Description, d32.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d33 = ExcelUtil.getTestData(SHEET, "TC33_View_InvalidImageURLs");
    test(`${d33.TestID} - ${d33.Description}`, async () => {
        Allure.attachDetails(d33.Description, d33.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d34 = ExcelUtil.getTestData(SHEET, "TC34_View_NullOrgDetails");
    test(`${d34.TestID} - ${d34.Description}`, async () => {
        Allure.attachDetails(d34.Description, d34.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d35 = ExcelUtil.getTestData(SHEET, "TC35_View_MissingDealPriceData");
    test(`${d35.TestID} - ${d35.Description}`, async () => {
        Allure.attachDetails(d35.Description, d35.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyDealPriceNotMisleading();
    });

    const d36 = ExcelUtil.getTestData(SHEET, "TC36_View_InvalidLatLong");
    test(`${d36.TestID} - ${d36.Description}`, async () => {
        Allure.attachDetails(d36.Description, d36.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d37 = ExcelUtil.getTestData(SHEET, "TC37_View_NoRecordAPI");
    test(`${d37.TestID} - ${d37.Description}`, async () => {
        Allure.attachDetails(d37.Description, d37.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d38 = ExcelUtil.getTestData(SHEET, "TC38_View_ImageLoadFailure");
    test(`${d38.TestID} - ${d38.Description}`, async () => {
        Allure.attachDetails(d38.Description, d38.Issue);
        await item.navigateToItems();
        await item.clickViewIconOnFirstRow();
        await item.verifyItemDetailsPageLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d39 = ExcelUtil.getTestData(SHEET, "TC39_View_UnauthorizedDirectURL");
    test(`${d39.TestID} - ${d39.Description}`, async () => {
        Allure.attachDetails(d39.Description, d39.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d40 = ExcelUtil.getTestData(SHEET, "TC40_View_APITimeout");
    test(`${d40.TestID} - ${d40.Description}`, async () => {
        Allure.attachDetails(d40.Description, d40.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    // ── Edit Item Details Screen — Positive ───────────────────────────────────

    const d41 = ExcelUtil.getTestData(SHEET, "TC41_Edit_UpdateSuccess");
    test(`${d41.TestID} - ${d41.Description}`, async () => {
        Allure.attachDetails(d41.Description, d41.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.fillItemForm({ name: d41.Name });
        await item.clickUpdate();
        await item.verifySuccessToast();
    });

    const d42 = ExcelUtil.getTestData(SHEET, "TC42_Edit_AddressFieldsSaved");
    test(`${d42.TestID} - ${d42.Description}`, async () => {
        Allure.attachDetails(d42.Description, d42.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.verifyAddressLabelsPresent();
    });

    const d43 = ExcelUtil.getTestData(SHEET, "TC43_Edit_MediaImagesDisplayed");
    test(`${d43.TestID} - ${d43.Description}`, async () => {
        Allure.attachDetails(d43.Description, d43.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.verifyMediaSectionPresent();
    });

    const d44 = ExcelUtil.getTestData(SHEET, "TC44_Edit_CancelNoSave");
    test(`${d44.TestID} - ${d44.Description}`, async () => {
        Allure.attachDetails(d44.Description, d44.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.clickCancel();
        await item.verifyPageHeadingVisible();
    });

    const d45 = ExcelUtil.getTestData(SHEET, "TC45_Edit_SuccessMessage");
    test(`${d45.TestID} - ${d45.Description}`, async () => {
        Allure.attachDetails(d45.Description, d45.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.fillItemForm({ name: d45.Name });
        await item.clickUpdate();
        await item.verifySuccessToast();
    });

    // ── Edit Item Details Screen — Negative ───────────────────────────────────

    const d46 = ExcelUtil.getTestData(SHEET, "TC46_Edit_BlankMandatoryField");
    test(`${d46.TestID} - ${d46.Description}`, async () => {
        Allure.attachDetails(d46.Description, d46.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.clearFormField(ItemPage.FORM_NAME_INPUT);
        await item.clickUpdate();
        await item.verifyValidationError();
    });

    const d47 = ExcelUtil.getTestData(SHEET, "TC47_Edit_InvalidLatLong");
    test(`${d47.TestID} - ${d47.Description}`, async () => {
        Allure.attachDetails(d47.Description, d47.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.fillItemForm({ latitude: d47.InvalidLatitude, longitude: d47.InvalidLongitude });
        await item.clickUpdate();
        await item.verifyValidationOrErrorDisplayed();
    });

    const d48 = ExcelUtil.getTestData(SHEET, "TC48_Edit_APIFailure");
    test(`${d48.TestID} - ${d48.Description}`, async () => {
        Allure.attachDetails(d48.Description, d48.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d49 = ExcelUtil.getTestData(SHEET, "TC49_Edit_BrokenImage");
    test(`${d49.TestID} - ${d49.Description}`, async () => {
        Allure.attachDetails(d49.Description, d49.Issue);
        await item.navigateToItems();
        await item.clickEditIconOnFirstRow();
        await item.verifyEditFormLoaded();
        await item.verifyPageDoesNotCrash();
    });

    const d50 = ExcelUtil.getTestData(SHEET, "TC50_Edit_UnauthorizedUpdate");
    test(`${d50.TestID} - ${d50.Description}`, async () => {
        Allure.attachDetails(d50.Description, d50.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    // ── Item Create Screen — Positive ─────────────────────────────────────────

    const d51 = ExcelUtil.getTestData(SHEET, "TC51_Create_AllMandatoryFields");
    test(`${d51.TestID} - ${d51.Description}`, async () => {
        Allure.attachDetails(d51.Description, d51.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({
            name: d51.Name, price: d51.Price, quantity: d51.Quantity,
            inventoryType: d51.InventoryType, stockCount: d51.StockCount,
        });
        await item.clickSave();
        await item.verifySuccessToast();
    });

    const d52 = ExcelUtil.getTestData(SHEET, "TC52_Create_ProductTypeDropdowns");
    test(`${d52.TestID} - ${d52.Description}`, async () => {
        Allure.attachDetails(d52.Description, d52.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ productType: d52.ProductType, type: d52.Type });
        await item.verifyProductTypeDropdownValue(d52.ProductType);
    });

    const d53 = ExcelUtil.getTestData(SHEET, "TC53_Create_DealPriceCalculated");
    test(`${d53.TestID} - ${d53.Description}`, async () => {
        Allure.attachDetails(d53.Description, d53.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ price: d53.Price, discount: d53.Discount });
        await item.verifyDealPricePresent();
    });

    const d54 = ExcelUtil.getTestData(SHEET, "TC54_Create_UploadMediaImages");
    test(`${d54.TestID} - ${d54.Description}`, async () => {
        Allure.attachDetails(d54.Description, d54.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.verifyMediaUploadFieldsPresent();
    });

    const d55 = ExcelUtil.getTestData(SHEET, "TC55_Create_InventoryType");
    test(`${d55.TestID} - ${d55.Description}`, async () => {
        Allure.attachDetails(d55.Description, d55.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ inventoryType: d55.InventoryType, stockCount: d55.StockCount });
        await item.verifyInventoryTypeDropdownValue(d55.InventoryType);
    });

    const d56 = ExcelUtil.getTestData(SHEET, "TC56_Create_TogglesEnabled");
    test(`${d56.TestID} - ${d56.Description}`, async () => {
        Allure.attachDetails(d56.Description, d56.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.verifyToggleOptionsPresent();
    });

    const d57 = ExcelUtil.getTestData(SHEET, "TC57_Create_BrandAvailability");
    test(`${d57.TestID} - ${d57.Description}`, async () => {
        Allure.attachDetails(d57.Description, d57.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ brand: d57.Brand, availability: d57.Availability });
        await item.verifyBrandFieldHasValue(d57.Brand);
    });

    const d58 = ExcelUtil.getTestData(SHEET, "TC58_Create_AddressDetails");
    test(`${d58.TestID} - ${d58.Description}`, async () => {
        Allure.attachDetails(d58.Description, d58.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({
            city: d58.City, state: d58.State, country: d58.Country,
            latitude: d58.Latitude, longitude: d58.Longitude,
        });
        await item.verifyCityFieldHasValue(d58.City);
    });

    const d59 = ExcelUtil.getTestData(SHEET, "TC59_Create_MultipleOptionalFields");
    test(`${d59.TestID} - ${d59.Description}`, async () => {
        Allure.attachDetails(d59.Description, d59.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({
            name: d59.Name, price: d59.Price, brand: d59.Brand, availability: d59.Availability,
        });
        await item.verifyPageDoesNotCrash();
    });

    const d60 = ExcelUtil.getTestData(SHEET, "TC60_Create_SaveSuccess");
    test(`${d60.TestID} - ${d60.Description}`, async () => {
        Allure.attachDetails(d60.Description, d60.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({
            name: d60.Name, price: d60.Price, quantity: d60.Quantity,
            inventoryType: d60.InventoryType, stockCount: d60.StockCount,
        });
        await item.clickSave();
        await item.verifySuccessToast();
        await item.verifyItemInList(d60.Name);
    });

    // ── Item Create Screen — Negative ─────────────────────────────────────────

    const d61 = ExcelUtil.getTestData(SHEET, "TC61_Create_BlankMandatoryFields");
    test(`${d61.TestID} - ${d61.Description}`, async () => {
        Allure.attachDetails(d61.Description, d61.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.clickSave();
        await item.verifyValidationError();
    });

    const d62 = ExcelUtil.getTestData(SHEET, "TC62_Create_NonNumericPrice");
    test(`${d62.TestID} - ${d62.Description}`, async () => {
        Allure.attachDetails(d62.Description, d62.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ price: d62.InvalidPrice });
        await item.clickSave();
        await item.verifyValidationOrErrorDisplayed();
    });

    const d63 = ExcelUtil.getTestData(SHEET, "TC63_Create_ZeroPrice");
    test(`${d63.TestID} - ${d63.Description}`, async () => {
        Allure.attachDetails(d63.Description, d63.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ price: d63.Price });
        await item.clickSave();
        await item.verifyValidationOrErrorDisplayed();
    });

    const d64 = ExcelUtil.getTestData(SHEET, "TC64_Create_InvalidImageFormat");
    test(`${d64.TestID} - ${d64.Description}`, async () => {
        Allure.attachDetails(d64.Description, d64.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.verifyMediaUploadFieldsPresent();
    });

    const d65 = ExcelUtil.getTestData(SHEET, "TC65_Create_OversizedImage");
    test(`${d65.TestID} - ${d65.Description}`, async () => {
        Allure.attachDetails(d65.Description, d65.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.verifyMediaUploadFieldsPresent();
    });

    const d66 = ExcelUtil.getTestData(SHEET, "TC66_Create_BlankAvailability");
    test(`${d66.TestID} - ${d66.Description}`, async () => {
        Allure.attachDetails(d66.Description, d66.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ name: d66.Name, price: d66.Price });
        await item.clickSave();
        await item.verifyValidationOrErrorDisplayed();
    });

    const d67 = ExcelUtil.getTestData(SHEET, "TC67_Create_NoInventoryType");
    test(`${d67.TestID} - ${d67.Description}`, async () => {
        Allure.attachDetails(d67.Description, d67.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ name: d67.Name, price: d67.Price });
        await item.clickSave();
        await item.verifyValidationOrErrorDisplayed();
    });

    const d68 = ExcelUtil.getTestData(SHEET, "TC68_Create_InvalidLatLong");
    test(`${d68.TestID} - ${d68.Description}`, async () => {
        Allure.attachDetails(d68.Description, d68.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ latitude: d68.InvalidLatitude, longitude: d68.InvalidLongitude });
        await item.clickSave();
        await item.verifyValidationOrErrorDisplayed();
    });

    const d69 = ExcelUtil.getTestData(SHEET, "TC69_Create_DuplicateItem");
    test(`${d69.TestID} - ${d69.Description}`, async () => {
        Allure.attachDetails(d69.Description, d69.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.fillItemForm({ name: d69.DuplicateName, price: d69.Price });
        await item.clickSave();
        await item.verifyValidationOrErrorDisplayed();
    });

    const d70 = ExcelUtil.getTestData(SHEET, "TC70_Create_APIFailure");
    test(`${d70.TestID} - ${d70.Description}`, async () => {
        Allure.attachDetails(d70.Description, d70.Issue);
        await item.navigateToItems();
        await item.clickCreate();
        await item.verifyCreatePageHeadingVisible();
        await item.verifyPageDoesNotCrash();
    });

    // ── Delete Item Popup — Positive ──────────────────────────────────────────

    const d71 = ExcelUtil.getTestData(SHEET, "TC71_Delete_ConfirmDeletes");
    test(`${d71.TestID} - ${d71.Description}`, async () => {
        Allure.attachDetails(d71.Description, d71.Issue);
        await item.navigateToItems();
        await item.clickDeleteIconOnFirstRow();
        await item.verifyDeletePopupVisible();
        await item.verifyDeletePopupWarningMessage();
        await item.confirmDelete();
        await item.verifyItemRemovedFromList(d71.ItemName);
    });

    const d72 = ExcelUtil.getTestData(SHEET, "TC72_Delete_PopupDisplayed");
    test(`${d72.TestID} - ${d72.Description}`, async () => {
        Allure.attachDetails(d72.Description, d72.Issue);
        await item.navigateToItems();
        await item.clickDeleteIconOnFirstRow();
        await item.verifyDeletePopupVisible();
        await item.verifyDeletePopupWarningMessage();
        await item.cancelDelete();
        await item.verifyDeletePopupClosed();
    });

    const d73 = ExcelUtil.getTestData(SHEET, "TC73_Delete_ItemRemovedAfterDelete");
    test(`${d73.TestID} - ${d73.Description}`, async () => {
        Allure.attachDetails(d73.Description, d73.Issue);
        await item.navigateToItems();
        await item.clickDeleteIconOnFirstRow();
        await item.verifyDeletePopupVisible();
        await item.confirmDelete();
        await item.verifySuccessToast();
        await item.verifyPageHeadingVisible();
    });

    const d74 = ExcelUtil.getTestData(SHEET, "TC74_Delete_CancelKeepsItem");
    test(`${d74.TestID} - ${d74.Description}`, async () => {
        Allure.attachDetails(d74.Description, d74.Issue);
        await item.navigateToItems();
        await item.clickDeleteIconOnFirstRow();
        await item.verifyDeletePopupVisible();
        await item.cancelDelete();
        await item.verifyDeletePopupClosed();
        await item.verifyItemInList(d74.ItemName);
    });

    // ── Delete Item Popup — Negative ──────────────────────────────────────────

    const d75 = ExcelUtil.getTestData(SHEET, "TC75_Delete_CancelNoDelete");
    test(`${d75.TestID} - ${d75.Description}`, async () => {
        Allure.attachDetails(d75.Description, d75.Issue);
        await item.navigateToItems();
        await item.clickDeleteIconOnFirstRow();
        await item.verifyDeletePopupVisible();
        await item.cancelDelete();
        await item.verifyDeletePopupClosed();
        await item.verifyItemInList(d75.ItemName);
    });

    const d76 = ExcelUtil.getTestData(SHEET, "TC76_Delete_UnauthorizedUser");
    test(`${d76.TestID} - ${d76.Description}`, async () => {
        Allure.attachDetails(d76.Description, d76.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d77 = ExcelUtil.getTestData(SHEET, "TC77_Delete_APIError");
    test(`${d77.TestID} - ${d77.Description}`, async () => {
        Allure.attachDetails(d77.Description, d77.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });

    const d78 = ExcelUtil.getTestData(SHEET, "TC78_Delete_NetworkFailure");
    test(`${d78.TestID} - ${d78.Description}`, async () => {
        Allure.attachDetails(d78.Description, d78.Issue);
        await item.navigateToItems();
        await item.verifyPageHeadingVisible();
    });
});
