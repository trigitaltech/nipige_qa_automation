export default class ReturnCancellationPolicyConstants {
    // ── URL segment ───────────────────────────────────────────────────────────
    static readonly PAGE_URL_SEGMENT = "setup/policy";

    // ── Page titles ───────────────────────────────────────────────────────────
    static readonly PAGE_TITLE = "Return, Cancellation & Market Policies";
    static readonly PAGE_SUBTITLE = "Manage platform policies and compliance documents";

    // ── Tab labels ────────────────────────────────────────────────────────────
    static readonly TAB_CANCELLATION = "Cancellation";
    static readonly TAB_RETURN = "Return";
    static readonly TAB_REPLACEMENT = "Replacement";
    static readonly TAB_REFUND = "Refund";
    static readonly TAB_MARKET_POLICIES = "Market Policies";

    // ── Cancellation tab — dropdown option values ─────────────────────────────
    static readonly STATUS_CREATED = "CREATED";
    static readonly STATUS_PAYMENT_PENDING = "PAYMENT_PENDING";
    static readonly STATUS_PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED";
    static readonly STATUS_INVENTORY_PENDING = "INVENTORY_PENDING";
    static readonly STATUS_INVENTORY_CONFIRMED = "INVENTORY_CONFIRMED";
    static readonly STATUS_FULFILLMENT_PENDING = "FULFILLMENT_PENDING";
    static readonly STATUS_READY_TO_SHIP = "READY_TO_SHIP";
    static readonly STATUS_SHIPPED = "SHIPPED";
    static readonly STATUS_DELIVERED = "DELIVERED";

    // ── Cancellation — fee types ──────────────────────────────────────────────
    static readonly FEE_TYPE_FLAT = "FLAT";
    static readonly FEE_TYPE_PERCENTAGE = "PERCENTAGE";

    // ── Cancellation — cancellation reasons ──────────────────────────────────
    static readonly REASON_CHANGED_MIND = "CHANGED_MIND";
    static readonly REASON_FOUND_CHEAPER = "FOUND_CHEAPER";
    static readonly REASON_ORDERED_BY_MISTAKE = "ORDERED_BY_MISTAKE";
    static readonly REASON_DELIVERY_TOO_SLOW = "DELIVERY_TOO_SLOW";
    static readonly REASON_OTHER = "OTHER";

    // ── Return tab values ─────────────────────────────────────────────────────
    static readonly SHIPPING_PAID_BY_SELLER = "SELLER";
    static readonly SHIPPING_PAID_BY_BUYER = "BUYER";

    static readonly RETURN_REASON_DEFECTIVE = "DEFECTIVE";
    static readonly RETURN_REASON_WRONG_ITEM = "WRONG_ITEM";
    static readonly RETURN_REASON_NOT_AS_DESCRIBED = "NOT_AS_DESCRIBED";
    static readonly RETURN_REASON_DAMAGED_IN_TRANSIT = "DAMAGED_IN_TRANSIT";
    static readonly RETURN_REASON_QUALITY_ISSUE = "QUALITY_ISSUE";

    // ── Refund tab values ─────────────────────────────────────────────────────
    static readonly REFUND_METHOD_ORIGINAL = "ORIGINAL_PAYMENT";
    static readonly REFUND_METHOD_WALLET = "WALLET";
    static readonly REFUND_METHOD_BANK = "BANK_TRANSFER";

    // ── Market Policies empty state ───────────────────────────────────────────
    static readonly MARKET_EMPTY_STATE = "No market overrides configured";

    // ── Timing ────────────────────────────────────────────────────────────────
    static readonly SETTLE_MS = 800;
    static readonly TOAST_TIMEOUT_MS = 8000;
    static readonly DROPDOWN_OPEN_MS = 400;
}
