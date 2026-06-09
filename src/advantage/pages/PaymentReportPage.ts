export default class PaymentReportPage {

    static BI_ANALYTICS =
        "//span[text()='BI & Analytics']";

    static PAYMENT_REPORTS =
        "//span[text()='Payment Reports']";

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

    static REFRESH =
        "//button[contains(.,'Refresh')]";

    static EXPORT_CSV =
        "//button[contains(.,'Export CSV')]";

    static PDF =
        "//button[contains(.,'PDF')]";

    static COLLECTION_STATUS =
        "(//input[@role='combobox'])[1]";

    static COLLECTION_DATE =
        "(//input[@role='combobox'])[2]";

    static CUSTOM_FROM_DATE =
        "#custom-date-from";

    static CUSTOM_TO_DATE =
        "#custom-date-to";

    static APPLY_BUTTON =
        "//button[text()='Apply']";
}