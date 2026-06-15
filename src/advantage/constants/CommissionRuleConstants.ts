export default class CommissionRuleConstants {
    static readonly PAGE_URL_SEGMENT = "setup/commission";
    static readonly PAGE_TITLE = "Commission Rules";

    static readonly ACTIVE_RULES_LABEL = "ACTIVE RULES";
    static readonly AVG_COMMISSION_LABEL = "AVG COMMISSION";
    static readonly PARTIES_COVERED_LABEL = "PARTIES COVERED";
    static readonly MONTH_TO_DATE_LABEL = "MONTH-TO-DATE";

    static readonly EXPECTED_COLUMNS = ["RULE NAME", "RULE TYPE", "APPLICABLE TO", "APPLIED ON", "RATE", "ACTIONS"];
    static readonly EXPECTED_SUMMARY_CARDS = [
        CommissionRuleConstants.ACTIVE_RULES_LABEL,
        CommissionRuleConstants.AVG_COMMISSION_LABEL,
        CommissionRuleConstants.PARTIES_COVERED_LABEL,
        CommissionRuleConstants.MONTH_TO_DATE_LABEL,
    ];

    static readonly TABS = ["All Rules", "All Types", "Basement", "Ground", "Develop"];
    
    // Options in Applicable To dropdown
    static readonly APPLICABLE_TO_OPTIONS = ["Select", "Partner", "Tenant", "Seller", "Delivery Agent", "Distributor"];
    
    // Test data search strings
    static readonly NO_MATCH_SEARCH = "NO_RECORDS_COMM_!@#_999999";
    static readonly SPECIAL_CHAR_SEARCH = "!@#$%^&*";

    // Timing constants
    static readonly TABLE_SETTLE_MS = 500;
    static readonly DROPDOWN_OPEN_MS = 300;
}
