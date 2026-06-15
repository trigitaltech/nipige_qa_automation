/**
 * Human-readable element descriptions for the Permission (Admin) module — passed to the UIActions
 * wrappers so every action is logged consistently. Kept separate from the locators (PermissionPage).
 */
export default class PermissionConstants {
    static readonly SEARCH_INPUT = "Permission search box";
    static readonly CREATE_BUTTON = "Create Permission button";
    static readonly NAME_INPUT = "Permission Name field";
    static readonly METHOD_COMBOBOX = "Method dropdown";
    static readonly URL_INPUT = "Resource URL field";
    static readonly SAVE_BUTTON = "Save button";
    static readonly DELETE_ICON = "Delete action icon";
    static readonly EDIT_ICON = "Edit action icon";
    static readonly DELETE_CONFIRM = "Delete confirmation button";
    static readonly NEXT_BUTTON = "Next pagination button";
    static readonly PREV_BUTTON = "Previous pagination button";

    // Search-by modes (data-driven from the Permission sheet's "Search_By" column).
    static readonly SEARCH_BY_NAME = "Permission Name";
    static readonly SEARCH_BY_URL = "Resource URL";

    // App messages.
    static readonly EMPTY_STATE = "No permissions found";
    static readonly CREATE_SUCCESS = "Permission created successfully";
    static readonly DELETE_SUCCESS = "Permission deleted successfully";
    static readonly UPDATE_SUCCESS = "Permission updated successfully";
    static readonly UPDATE_BUTTON = "Update button";
}
