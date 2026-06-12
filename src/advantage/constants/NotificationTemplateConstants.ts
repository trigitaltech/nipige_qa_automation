/**
 * Human-readable element descriptions for the Notification Template (Tenant) module — passed to the
 * UIActions wrappers so every action is logged consistently. Locators live in NotificationTemplatePage.
 */
export default class NotificationTemplateConstants {
    static readonly SEARCH_INPUT = "Templates search box";
    static readonly CREATE_BUTTON = "Create Template button";
    static readonly RELOAD_BUTTON = "Reload (refresh) button";
    static readonly CONCERN_COMBOBOX = "Concern dropdown";
    static readonly SUBJECT_INPUT = "Subject field";
    static readonly BODY_TEXTAREA = "Body (HTML) field";
    static readonly FROM_NAME_INPUT = "From Name field";
    static readonly FROM_EMAIL_INPUT = "From Email field";
    static readonly SUBMIT_BUTTON = "Submit button";
    static readonly DELETE_ICON = "Delete action icon";
    static readonly DELETE_CONFIRM = "Delete confirmation button";
    static readonly NEXT_BUTTON = "Next pagination button";
    static readonly PREV_BUTTON = "Previous pagination button";

    // Search modes (data-driven from the sheet's "Search Type" column).
    static readonly SEARCH_BY_CONCERN = "Concern";
    static readonly SEARCH_BY_BODY = "Body";

    // App messages.
    static readonly EMPTY_STATE = "No data available.";
    static readonly CREATE_SUCCESS = "Template created successfully";
    static readonly DELETE_SUCCESS = "Template deleted successfully";

    // A valid existing concern reused for the create flow (TC05).
    static readonly DEFAULT_CONCERN = "PROMOTIONAL";
    static readonly EMAIL_TYPE = "Email";
}
