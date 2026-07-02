/**
 * Central credential manager.
 *
 * Credentials are NEVER hard-coded here — they are read from a non-committed .env file,
 * keyed by role. This keeps real company accounts out of source control and makes the
 * suite deterministic: each role test always uses the same configured account.
 *
 * Required .env keys (see .env.example):
 *   TENANT_EMAIL / TENANT_PASSWORD / TENANT_ID
 *   SELLER_EMAIL / SELLER_PASSWORD
 *   DEALER_EMAIL / DEALER_PASSWORD
 *   DISTRIBUTOR_EMAIL / DISTRIBUTOR_PASSWORD
 *   DELIVERY_EMAIL / DELIVERY_PASSWORD
 *   USER_EMAIL / USER_PASSWORD
 * Optional overrides (fall back to Excel "LoginTest" sheet):
 *   BULK_PROMOTION_TENANT_EMAIL / BULK_PROMOTION_TENANT_PASSWORD
 */

export enum Role {
    ADMIN = "ADMIN",
    BULK_PROMOTION_TENANT = "BULK_PROMOTION_TENANT",
    TENANT = "TENANT",
    SELLER = "SELLER",
    DEALER = "DEALER",
    DISTRIBUTOR = "DISTRIBUTOR",
    DELIVERY = "DELIVERY",
    USER = "USER",
}

export interface Credential {
    role: Role;
    email: string;
    password: string;
    tenantId?: string;
}

/**
 * Reads a required environment variable, failing fast with a clear message if it is missing.
 * @param name environment variable name
 */
function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var '${name}'. Set it in your non-committed .env file `
            + `(copy .env.example to .env and fill in the company credentials).`);
    }
    return value;
}

/**
 * Returns the credential for a given role, read lazily from the environment so that an
 * unrelated test never fails just because a different role's credential is unset.
 * @param role the role whose credential is required
 */
export function getCredential(role: Role): Credential {
    switch (role) {
        case Role.ADMIN: {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const adminRow = require("@utils/ExcelUtil").default.getTestData("LoginTest", "TC06_AdminValidLogin");
            return {
                role,
                email: process.env.ADMIN_EMAIL || adminRow.UserName,
                password: process.env.ADMIN_PASSWORD || adminRow.Password,
            };
        }
        case Role.BULK_PROMOTION_TENANT: {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const bulkRow = require("@utils/ExcelUtil").default.getTestData("LoginTest", "TC10_BulkPromotionTenantLogin");
            return {
                role,
                email: process.env.BULK_PROMOTION_TENANT_EMAIL || bulkRow.UserName,
                password: process.env.BULK_PROMOTION_TENANT_PASSWORD || bulkRow.Password,
            };
        }
        case Role.TENANT: {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const tenantRow = require("@utils/ExcelUtil").default.getTestData("LoginTest", "TC01_ValidLogin");
            return {
                role,
                email: process.env.TENANT_EMAIL || tenantRow.UserName,
                password: process.env.TENANT_PASSWORD || tenantRow.Password,
                tenantId: process.env.TENANT_ID,
            };
        }
        case Role.SELLER: {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const sellerRow = require("@utils/ExcelUtil").default.getTestData("LoginTest", "TC04_ValidSellerLogin");
            return {
                role,
                email: process.env.SELLER_EMAIL || sellerRow.UserName,
                password: process.env.SELLER_PASSWORD || sellerRow.Password,
            };
        }
        case Role.DEALER:
            return { role, email: required("DEALER_EMAIL"), password: required("DEALER_PASSWORD") };
        case Role.DISTRIBUTOR:
            return { role, email: required("DISTRIBUTOR_EMAIL"), password: required("DISTRIBUTOR_PASSWORD") };
        case Role.DELIVERY:
            return { role, email: required("DELIVERY_EMAIL"), password: required("DELIVERY_PASSWORD") };
        case Role.USER:
            return { role, email: required("USER_EMAIL"), password: required("USER_PASSWORD") };
        default:
            throw new Error(`Unknown role: ${role}`);
    }
}
