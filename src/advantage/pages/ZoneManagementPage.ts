export default class ZoneManagementPage {
    // ── Sidebar navigation ────────────────────────────────────────────────────
    // "Manage Services" parent menu — click to expand the submenu
    static readonly MENU_MANAGE_SERVICES = 'button:has-text("Manage Services"), a:has-text("Manage Services")';

    // "Zone Management" submenu link that opens the zone listing
    static readonly MENU_ZONE_MANAGEMENT = 'a:has-text("Zone Management")';

    // ── Listing page ──────────────────────────────────────────────────────────
    // "Create Zone" / "+ Zone" button at the top-right of the listing
    static readonly CREATE_ZONE_BUTTON = 'button:has-text("Create Zone"), button:has-text("+ Zone"), button:has-text("Add Zone")';

    // Search input on the listing page
    static readonly SEARCH_INPUT = 'input[placeholder="Search zones..."], input[aria-label*="Search zones"]';

    // Row in the zone listing table matching a given zone name
    static zoneRow(zoneName: string): string {
        return `tr:has-text("${zoneName}"), [data-testid="zone-row"]:has-text("${zoneName}")`;
    }

    // Cell showing the zone name in the listing table (used after search to verify)
    static readonly ZONE_NAME_CELL = 'table tbody tr td:first-child';

    // ── Step 1: Zone Details ──────────────────────────────────────────────────
    // Confirmed from DevTools: <input id="zone-name-input">
    static readonly ZONE_NAME_INPUT = '#zone-name-input';

    // Confirmed from DevTools: <input id="zone-code-input">
    static readonly ZONE_CODE_INPUT = '#zone-code-input';

    // Confirmed from DevTools: <input id="zone-desc"> (or textarea — same id)
    static readonly DESCRIPTION_INPUT = '#zone-desc';

    // Confirmed from DevTools: <input id="zone-city-input">
    static readonly CITY_INPUT = '#zone-city-input';

    // Confirmed from DevTools: <input id="zone-state-input">
    static readonly STATE_INPUT = '#zone-state-input';

    // Confirmed from DevTools: status is a custom combobox — input[role="combobox"] opens the list
    static readonly STATUS_COMBOBOX = 'input[role="combobox"]';

    // "Next" button — shared across all wizard steps
    static readonly STEP1_NEXT = 'button:has-text("Next")';

    // ── Step 2: Coverage Area ─────────────────────────────────────────────────
    // Confirmed from DevTools: <input placeholder="Enter zip code">
    static readonly ZIP_CODE_INPUT = 'input[placeholder="Enter zip code"]';

    // Confirmed from DevTools: <button>Add</button> adjacent to the ZIP input
    static readonly ADD_ZIP_BUTTON = 'button:has-text("Add")';

    // Tag / chip showing a successfully added ZIP code — scoped to contain the ZIP value
    static zipCodeTag(zip: string): string {
        return `span:has-text("${zip}"), [data-testid="zip-tag"]:has-text("${zip}"), .tag:has-text("${zip}")`;
    }

    // Coverage summary card / section that appears after at least one ZIP is added
    static readonly COVERAGE_SUMMARY = '[data-testid="coverage-summary"], .coverage-summary, :text("Coverage Summary")';

    // Step 2 Next — filtered to visible only at call time (multiple Next buttons exist in the DOM
    // across wizard steps; hidden step panels keep their buttons rendered but not visible)
    static readonly STEP2_NEXT = 'button:has-text("Next")';

    // ── Step 3: Slot Configuration ────────────────────────────────────────────
    // "Enable Slot Booking" toggle switch
    static readonly SLOT_BOOKING_TOGGLE = 'button[role="switch"], input[type="checkbox"]:near(:text("Slot Booking"))';

    // Confirmed from DevTools: two bare <input min="1" type="number"> inputs — no label element,
    // no name, no placeholder. Distinguished by DOM order: capacity = nth(0), booking = nth(1).
    static readonly DEFAULT_CAPACITY_INPUT = 'input[type="number"]';
    static readonly ADVANCE_BOOKING_INPUT = 'input[type="number"]';

    // Confirmed from DevTools: <input role="combobox" value=""> — same combobox pattern as Status
    static readonly TIMEZONE_COMBOBOX = 'input[role="combobox"]';

    // Timezone option inside the open dropdown list
    static timezoneOption(label: string): string {
        return `[role="option"]:has-text("${label}"), li:has-text("${label}")`;
    }

    // Day row container — used to scope Start/End time inputs to a specific weekday
    static dayRow(day: string): string {
        return `tr:has-text("${day}"), [data-day="${day.toLowerCase()}"], div:has-text("${day}")`;
    }

    // Start time input scoped inside a day row (chained with .locator())
    static readonly DAY_START_TIME = 'input[name*="startTime"], input[placeholder*="Start"], input[type="time"]';

    // End time input scoped inside a day row (chained with .locator())
    static readonly DAY_END_TIME = 'input[name*="endTime"], input[placeholder*="End"], input[type="time"]:nth-of-type(2)';

    // Confirmed from DevTools: <button type="button">Save</button> — exact match avoids false positives
    static readonly SAVE_BUTTON = 'button:text-is("Save")';

    // ── Post-save verification ────────────────────────────────────────────────
    // After Save the app returns to the zone list panel on the left side.
    static zoneCardByName(zoneName: string): string {
        return `button:has-text("${zoneName}"), li:has-text("${zoneName}"), div:has-text("${zoneName}"), span:has-text("${zoneName}"), [class*="zone"]:has-text("${zoneName}"), :text("${zoneName}")`;
    }

    // Strict zone-list item selector used with .filter({ hasText }) to avoid matching ancestor containers.
    // Targets the leaf-level card/list-item element that receives click events in the left panel.
    static readonly ZONE_CARD_ITEM = 'li[class*="zone"], [class*="zone-card"], [class*="zoneCard"], [class*="zone-item"], [class*="zoneItem"], li[class*="item"]';

    // ── Zone detail / edit panel ──────────────────────────────────────────────
    // Update button that switches the detail panel into edit mode
    static readonly UPDATE_BUTTON = 'button:text-is("Update")';

    // Delete button on the detail panel (exact match only — avoids matching confirmation dialog buttons)
    static readonly DELETE_BUTTON = 'button:text-is("Delete")';

    // Confirmation dialog — "Confirm" or "Yes" only; never re-matches the original Delete button
    static readonly DELETE_CONFIRM_BUTTON = 'button:text-is("Confirm"), button:text-is("Yes")';

    // Cancel button scoped to a dialog/modal overlay to avoid matching wizard Cancel buttons
    static readonly DELETE_CANCEL_BUTTON = '[role="dialog"] button:text-is("Cancel"), [role="alertdialog"] button:text-is("Cancel"), button:text-is("No")';

    // ── Inline validation messages ────────────────────────────────────────────
    // Generic error/validation text element rendered below a field
    static readonly VALIDATION_MESSAGE = '[class*="error"], [class*="invalid"], p[class*="text-red"], span[class*="text-red"], .field-error';

    // Validation message scoped to a specific field label — chains from the label upward
    static validationNear(fieldLabel: string): string {
        return `:text("${fieldLabel}") ~ [class*="error"], :text("${fieldLabel}") ~ p, :text("${fieldLabel}") + p`;
    }

    // ── Zone configuration detail panel (read-only view) ─────────────────────
    // Tab visible in the right panel when a zone is selected — "Zone Details"
    static readonly ZONE_DETAIL_PANEL = 'text=/Zone Details/i';

    // No-results message shown in the zone list when search finds nothing
    static readonly NO_RESULTS_MESSAGE = 'text=/No zones match/i';

    // Empty-state panel shown in the right panel after a zone is deleted
    static readonly SELECT_A_ZONE_PANEL = 'text=/Select a zone/i';
}
