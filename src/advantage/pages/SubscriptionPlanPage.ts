/**
 * Page Object for the Subscription Plan (Tenant) module — Setup → Subscription Plan
 * (route /setup/subscriptionplan).
 *
 * The create form has NO id/name/for attributes, so fields are anchored to their visible label via
 * a "following input" XPath (robust to layout changes), or to a stable placeholder where one exists.
 * Custom comboboxes follow the same pattern as the rest of the app: an <input role="combobox"> with
 * an adjacent icon button (aria-label="Open options") that reveals a portal listbox of [role=option].
 */
export default class SubscriptionPlanPage {
    static readonly LISTING_PATH = "setup/subscriptionplan";
    static readonly CREATE_PATH = "setup/subscriptionplan/create";

    // ---- Navigation (sidebar) — exact accessible names (no partial-text matching) ----
    static readonly SETUP_MENU = 'Setup';                  // sidebar "Setup" group toggle (button)
    static readonly SUBSCRIPTION_LINK = 'Subscription Plan'; // sidebar "Subscription Plan" item (exact)

    // ---- Module guard ----
    // URL must reference the subscription plan module; the listing heading the app renders is the
    // plural "Subscription Plans" (the sidebar item is the singular "Subscription Plan").
    static readonly URL_GUARD = /subscription[-]?plan|subscriptionplan|subscription/i;
    static readonly HEADING_GUARD = /^Subscription Plans?$/i;
    static readonly MODULE_HEADING = 'main h1, main h2';

    // ---- Listing page ----
    static readonly PAGE_HEADING = 'main >> role=heading[name="Subscription Plans"]';
    static readonly CREATE_PLAN_BUTTON = 'main >> button:has-text("Create Plan")';
    static readonly SEARCH_INPUT = 'main >> input[placeholder*="Search plan name"]';
    static readonly SCOPE_FILTER = 'main >> select';                 // native <select>: All Scopes/Partner/Customer
    static readonly CLEAR_BUTTON = 'main >> button:has-text("Clear")';
    static readonly LISTING_ROWS = 'main table tbody tr';
    // Dashboard metric cards (values are dynamic — assert presence, not exact numbers).
    static readonly DASHBOARD_CARDS = ["TOTAL PLANS", "ACTIVE", "PARTNERS", "TOTAL MRR"];
    // The "Applicable To" badge (scope) cell is the first column of every listing row.
    static readonly ROW_SCOPE_CELL = 'main table tbody tr >> td:first-child';
    // Pagination is absent in the current environment — kept defensive (validate if present, else log).
    static readonly PAGINATION_NEXT = 'main >> button:has-text("Next"), main >> button[aria-label*="next" i], '
        + 'main >> button[aria-label*="page" i]';

    /** A listing row matched by the plan name it contains. */
    static planRow(name: string): string {
        return `main table tbody tr:has-text("${name}")`;
    }
    /** View (eye) / Edit (pencil) icon for a given plan row (icon buttons with aria-label). */
    static viewIconForPlan(name: string): string {
        return `main table tbody tr:has-text("${name}") >> button[aria-label="View"]`;
    }
    static editIconForPlan(name: string): string {
        return `main table tbody tr:has-text("${name}") >> button[aria-label="Edit"]`;
    }

    // ---- View / Edit pages ----
    static readonly VIEW_EDIT_BUTTON = 'main >> button:has-text("Edit")';
    /** On the View page, the value text that follows a field's label paragraph. */
    static viewFieldValue(label: string): string {
        return `xpath=//p[normalize-space(.)="${label}"]/following::*[normalize-space(string())!=""][1]`;
    }
    /** A feature chip on the View page (rendered as "✓ <feature>"). */
    static viewFeature(feature: string): string {
        return `main >> text="✓ ${feature}"`;
    }

    // ---- Create / Edit form: stable-placeholder fields ----
    static readonly FORM_HEADING = 'main >> role=heading[name="Create Subscription Plan"]';
    static readonly PLAN_NAME_INPUT = 'input[placeholder="e.g. TESSST, RANJI"]';
    static readonly DESCRIPTION_INPUT = '[placeholder="Brief plan description..."]';
    static readonly TAX_CODE_COMBOBOX = 'input[role="combobox"][placeholder="e.g. HSN_0007"]';
    static readonly SCOPE_COMBOBOX = 'input[role="combobox"][placeholder="Select scope..."]';
    static readonly FEATURE_INPUT = 'input[placeholder="Feature description..."]';
    static readonly ADD_FEATURE_BUTTON = 'main >> button:has-text("Add Feature")';
    // Auto Renewal is a role=switch button that follows the "Auto Renewal" label text.
    static readonly AUTO_RENEWAL_SWITCH =
        'xpath=//*[normalize-space(.)="Auto Renewal"]/following::button[@role="switch"][1]';
    // The live Plan Preview side panel (complementary landmark, heading "Plan Preview").
    static readonly PREVIEW_PANEL = 'role=complementary';
    static readonly PREVIEW_HEADING = "Plan Preview";
    // On the Edit page the Features section's add button is labelled just "Add" (not "Add Feature").
    static readonly EDIT_ADD_FEATURE_BUTTON =
        'xpath=//*[normalize-space(text())="Features"]/following::button[normalize-space(.)="Add"][1]';
    // On the Edit page the existing feature is rendered as a plain editable textbox (no placeholder).
    static readonly EDIT_FEATURE_INPUT =
        'xpath=//*[normalize-space(text())="Features"]/following::input[1]';
    // On the Edit page the Description is a <textarea> (no placeholder), located after its label.
    static readonly EDIT_DESCRIPTION_INPUT =
        'xpath=//label[contains(normalize-space(.),"Description")]/following::textarea[1]';
    static readonly SUBMIT_CREATE_BUTTON = 'main >> button:text-is("Create Plan")';
    static readonly UPDATE_BUTTON = 'main >> button:has-text("Update")';
    static readonly CANCEL_BUTTON = 'main >> button:has-text("Cancel")';
    static readonly BACK_BUTTON = 'main >> button:has-text("Back")';

    // ---- Custom-combobox option (portal listbox) ----
    static optionByText(text: string): string {
        return `[role="option"]:text-is("${text}")`;
    }

    // ---- Label-relative builders (for the no-id form fields) ----
    /** The first text/number input that follows a field's label. */
    static inputByLabel(label: string): string {
        return `xpath=//label[contains(normalize-space(.),"${label}")]/following::input[1]`;
    }
    /** The first numeric (spinbutton) input that follows a field's label. */
    static numberByLabel(label: string): string {
        return `xpath=//label[contains(normalize-space(.),"${label}")]/following::input[@type="number"][1]`;
    }
    /** The combobox input that follows a field's label. */
    static comboboxByLabel(label: string): string {
        return `xpath=//label[contains(normalize-space(.),"${label}")]/following::input[@role="combobox"][1]`;
    }
    /** The "Open options" toggle of the combobox that follows a field's label. */
    static comboboxToggleByLabel(label: string): string {
        return `xpath=//label[contains(normalize-space(.),"${label}")]`
            + `/following::button[@aria-label="Open options"][1]`;
    }
    /** A toggle/switch button that follows a field's label (Status, Auto Renewal). */
    static toggleByLabel(label: string): string {
        return `xpath=//*[contains(normalize-space(.),"${label}")]/following::button[@role="switch" `
            + `or normalize-space(.)="ON" or normalize-space(.)="OFF"][1]`;
    }

    // ---- Validation / error feedback (negative cases) ----
    // Red field-level validation messages and the top-right error toast (react-toastify error).
    static readonly ERROR_TOAST = '.Toastify__toast--error';
    static readonly INLINE_ERROR = 'main >> p.text-red-500, main >> span.text-red-500, '
        + 'main >> [class*="text-red"], main >> [aria-invalid="true"]';
}
