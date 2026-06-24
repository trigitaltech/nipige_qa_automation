export default class AdminDashboardPage {

    static DASHBOARD_MENU =
        "//span[text()='Dashboard']";

    static PAGE_HEADER =
        "//h1[text()='Dashboard']";

    // Dashboard Filter
    static TODAY_BUTTON =
        "//button[normalize-space()='Today']";

    static SEVEN_DAYS_BUTTON =
        "//button[normalize-space()='7 days']";

    static THIRTY_DAYS_BUTTON =
        "//button[normalize-space()='30 days']";

    static CUSTOM_BUTTON =
        "//button[normalize-space()='Custom']";

    // Custom Date Popup
    static CUSTOM_DATE_DIALOG =
        "//div[@role='dialog']";

    static FROM_DATE =
        "//input[@id='custom-date-from']";

    static TO_DATE =
        "//input[@id='custom-date-to']";

    static APPLY_BUTTON =
        "//button[normalize-space()='Apply']";

    // // Order Chart Date Filter
    // static ORDER_CHART_DATE_FILTER =
    //     "//h3[text()='Order Chart']/ancestor::div[@data-slot='card-content']//input[@value='30 days']";

    // // Top Revenue Date Filter
    // static TOP_REVENUE_DATE_FILTER =
    //     "//h3[text()='Top Revenue Category']/ancestor::div[@data-slot='card-content']//input[@value='30 days']";

    static ORDER_CHART_DATE_FILTER =
    "(//input[@role='combobox'])[2]";

static TOP_REVENUE_DATE_FILTER =
    "(//input[@role='combobox'])[4]";

    // Dropdown Options
    static TODAY_OPTION =
        "//button[normalize-space()='Today']";

    static SEVEN_DAYS_OPTION =
        "//button[normalize-space()='7 days']";

    static THIRTY_DAYS_OPTION =
        "//button[normalize-space()='30 days']";

    static CUSTOM_OPTION =
        "//button[normalize-space()='Custom']";
}