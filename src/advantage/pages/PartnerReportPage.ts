// export default class PartnerReportPage {

//     static BI_ANALYTICS =
//         "//span[text()='BI & Analytics']";

//     static PARTNER_REPORTS =
//         "//span[text()='Partner Reports']";

//     static PAGE_HEADER =
//         "//h1[text()='Partner Report']";

//     static TODAY =
//         "//button[text()='Today']";

//     static SEVEN_DAYS =
//         "//button[text()='7D']";

//     static THIRTY_DAYS =
//         "//button[text()='30D']";

//     static NINETY_DAYS =
//         "//button[text()='90D']";

//     static YTD =
//         "//button[text()='YTD']";

//     static CUSTOM =
//         "//button[contains(.,'Custom')]";

//     static REFRESH =
//         "//button[contains(.,'Refresh')]";

//     static CUSTOM_FROM_DATE =
//         "#custom-date-from";

//     static CUSTOM_TO_DATE =
//         "#custom-date-to";

//     static APPLY_BUTTON =
//         "button[data-variant='default']";

//     static TOP_PERFORMERS =
//         "//h2[contains(text(),'Top 10 Performers')]";

//     static ORDER_VALUE_TAB =
//         "//button[text()='Order Value']";

//     static ORDER_COUNT_TAB =
//         "//button[text()='Order Count']";
// }


export default class PartnerReportPage {

    static BI_ANALYTICS =
        "//span[text()='BI & Analytics']";

    static PARTNER_REPORTS =
        "//span[text()='Partner Reports']";

    static PAGE_HEADER =
        "//h1[contains(text(),'Partner Report')]";

    // Date Filters

    static TODAY =
        "//button[text()='Today']";

    static SEVEN_DAYS =
        "//button[text()='7D']";

    static THIRTY_DAYS =
        "//button[text()='30D']";

    static NINETY_DAYS =
        "//button[text()='90D']";

    static YTD =
        "//button[text()='YTD']";

    static CUSTOM =
        "//button[contains(.,'Custom')]";

    static REFRESH =
        "//button[contains(.,'Refresh')]";

    // Custom Date

    static CUSTOM_FROM_DATE =
        "#custom-date-from";

    static CUSTOM_TO_DATE =
        "#custom-date-to";

    static APPLY_BUTTON =
        "button[data-variant='default']";

    // Top Performers

    static TOP_PERFORMERS =
        "//h2[contains(text(),'Top 10 Performers')]";

    static ORDER_VALUE_TAB =
        "//button[text()='Order Value']";

    static ORDER_COUNT_TAB =
        "//button[text()='Order Count']";

    // Partner Directory

    static PARTNER_DIRECTORY_HEADER =
        "//h2[contains(text(),'Partner Directory')]";

    static SEARCH_BOX =
    "//input[@placeholder='Search partner name, phone, email...']";

static TYPE_DROPDOWN =
    "(//input[@role='combobox'])[1]";

static STATUS_DROPDOWN =
    "(//input[@role='combobox'])[2]";
}