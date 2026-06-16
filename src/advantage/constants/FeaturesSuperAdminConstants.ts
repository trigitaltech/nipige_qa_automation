/**
 * Human-readable element descriptions and expected values for the Features (Super Admin) module.
 * Locators live in the Page object; workflows and assertions live in Steps.
 */
export default class FeaturesSuperAdminConstants {
    static readonly SEARCH_INPUT = "Features search box";
    static readonly CREATE_BUTTON = "Create Feature button";
    static readonly REFRESH_BUTTON = "Refresh icon";
    static readonly VIEW_ICON = "View action icon";
    static readonly EDIT_ICON = "Edit action icon";
    static readonly DELETE_ICON = "Delete action icon";
    static readonly FEATURE_NAME_INPUT = "Feature Name field";
    static readonly DESCRIPTION_INPUT = "Description field";
    static readonly PERMISSION_DROPDOWN = "Permission dropdown";
    static readonly ADD_PERMISSION_BUTTON = "Add Permission button";
    static readonly MENU_DROPDOWN = "Menu Item dropdown";
    static readonly TA_SCOPE = "TA scope checkbox";
    static readonly PARTNER_SCOPE = "PARTNER scope checkbox";
    static readonly SAVE_BUTTON = "Save button";
    static readonly CANCEL_BUTTON = "Cancel button";

    static readonly EMPTY_STATE = "No features match your search.";
    static readonly FEATURE_NOT_AVAILABLE = "Feature not available";
    static readonly FEATURE_DOES_NOT_EXIST = "Feature does not exist";

    static readonly STOCK_POINTS = "Stock Points";
    static readonly STOCK_POINTS_DESCRIPTION = "Stock Points creation";
    static readonly INVENTORY = "Inventory";
    static readonly ITEMS = "Items";
    static readonly PROFILE_MANAGE = "profile.manage";
    static readonly ORDERS_OWN_VIEW = "orders.own.view";

    static readonly UPDATED_SUFFIX = "_UPDATED";
}
