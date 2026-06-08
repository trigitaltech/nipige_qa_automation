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

    /**
     * Some "Login as" personas are scoped to a specific tenant. After their role button is
     * selected the login screen reveals a "Select Tenant" dropdown that must be set before
     * submitting, otherwise the app rejects the login with a "Please select a tenant" toast.
     *
     * This map declares which tenant each persona logs in under. A persona that is NOT listed
     * here (e.g. "tenant") does not require a tenant selection and is left untouched.
     * To support a new tenant-scoped persona, add a single entry — no other code changes needed.
     */
    static readonly PERSONA_TENANTS: Readonly<Record<string, string>> = {
        seller: "FreshCart",
    };

    /**
     * Returns the tenant a persona must log in under, or undefined when the persona is not
     * tenant-scoped. Persona keys are matched case-insensitively against {@link PERSONA_TENANTS}.
     * @param persona persona as stored in the test data (e.g. "seller")
     */
    static tenantFor(persona: string): string | undefined {
        return HomePage.PERSONA_TENANTS[persona.trim().toLowerCase()];
    }

    // The "Select Tenant" control is a custom (non-native) dropdown: it renders a placeholder
    // and a popup listbox rather than an <option> list, so it is driven by click-to-open +
    // click-the-option rather than Playwright's selectOption(). It exposes role="combobox",
    // which is unambiguous — unlike the "Select Tenant" text, which also appears as the field
    // label above the control.
    static readonly TENANT_DROPDOWN = '[role="combobox"]';

    /**
     * Builds the selector for a tenant entry inside the opened "Select Tenant" dropdown list.
     * The options render in a portal listbox with role="option", so we scope to that role to
     * avoid colliding with the same text elsewhere on the page (e.g. a confirmation toast).
     * @param tenant exact tenant name as shown in the list, e.g. "FreshCart"
     */
    static tenantOption(tenant: string): string {
        return `[role="option"]:has-text("${tenant}")`;
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
