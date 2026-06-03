export default class HomePage {
    static readonly USER_ICON = "#menuUser";
    // Nipige login screen (migration app). The login form is rendered directly on /login,
    // so there is no user-icon dropdown to open first as there was on the legacy AOS site.
    static readonly USER_NAME_TEXTBOX = "#username";
    static readonly PASSWORD_TEXTBOX = "#password";
    static readonly REMEMBER_ME_CHECKBOX = "[name='remember_me']";
    static readonly SIGN_IN_BUTTON = 'button:text-is("Log in")';
    // After a successful login the header shows a profile menu trigger (aria-haspopup).
    // We use its visibility as the "logged-in" signal and click it to reach Logout.
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    static readonly LOGGED_IN_USER = "a#menuUserLink>span.hi-user";
    // Failed logins surface a react-toastify error toast (e.g. "Invalid password!!").
    static readonly SIGN_IN_ERROR_MESSAGE = ".Toastify__toast--error";
    static readonly SIGN_OUT_LINK = 'text="Logout"';

    /**
     * Builds the selector for a "Login as" role button on the Nipige login screen
     * (Admin, Tenant, Seller, Office, Distributor, Dealer, Manufacturer, Sub Dealer).
     * @param role exact button label as shown on the screen, e.g. "Tenant"
     */
    static loginAsRole(role: string): string {
        return `button:text-is("${role}")`;
    }
    static readonly CREATE_NEW_ACCOUNT_LINK = "[translate='CREATE_NEW_ACCOUNT']";
    static readonly CATEGORY_DROPDOWN = "[name='categoryListboxContactUs']";
    static readonly PRODUCT_DROPDOWN = "[name='productListboxContactUs']";
    static readonly SUBJECT_TEXTAREA = "[name='subjectTextareaContactUs']";
    static readonly EMAIL_TEXTBOX = "[name='emailContactUs']";
    static readonly SEND_BUTTON = "#send_btn";
    static readonly CONTACT_US_MESSAGE = ".roboto-regular.successMessage";
    static readonly SEARCH_ICON = "#searchSection";
    static readonly SEARCH_TEXTBOX = "#autoComplete";
    static readonly SEARCH_CLOSE_IMAGE = "div.autoCompleteCover>div>img";
    static readonly HELP_ICON = "#menuHelp";
    static readonly MANAGEMENT_CONSOLE_LINK = "div#helpMiniTitle [translate='CONFIG_TOOL']";
}
