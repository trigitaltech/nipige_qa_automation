export default class DashboardPage {
    static readonly DASHBOARD_MENU = "//span[text()='Dashboard']";

    static readonly DASHBOARD_HEADER = "//h1[contains(text(),'Dashboard')]";

    static readonly BUSINESS_OVERVIEW = "text=Business Overview";

    static readonly ANALYTICS = "text=Analytics";

    static readonly PROFILE_NAME = "//button[contains(.,'FRESHCART')]";

    static readonly TOP_FILTER_TODAY = "//button[contains(text(),'Today')]";

    static readonly TOP_FILTER_7_DAYS = "//button[contains(text(),'7 days')]";

    static readonly TOP_FILTER_30_DAYS = "//button[contains(text(),'30 days')]";

    static readonly TOP_FILTER_CUSTOM = "//button[contains(text(),'Custom')]";

    static readonly ORDER_CHART_DROPDOWN = "(//button[contains(@class,'justify-between')])[1]";

    static readonly TOP_REVENUE_DROPDOWN = "(//button[contains(@class,'justify-between')])[2]";

    static readonly DROPDOWN_TODAY = "//ul[@role='listbox']//button[contains(text(),'Today')]";

    static readonly DROPDOWN_7_DAYS = "//ul[@role='listbox']//button[contains(text(),'7 days')]";

    static readonly DROPDOWN_30_DAYS = "//ul[@role='listbox']//button[contains(text(),'30 days')]";

    static readonly DROPDOWN_CUSTOM = "//ul[@role='listbox']//button[contains(text(),'Custom')]";
}
