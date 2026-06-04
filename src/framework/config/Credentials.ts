/**
 * Central credential manager.
 *
 * Credentials are NEVER hard-coded here — they are read from a non-committed .env file,
 * keyed by role. This keeps real company accounts out of source control and makes the
 * suite deterministic: each role test always uses the same configured account.
 *
 * Required .env keys (see .env.example):
 *   TENANT_EMAIL / TENANT_PASSWORD / TENANT_NAME
 *   SELLER_EMAIL / SELLER_PASSWORD / SELLER_TENANT
 *   DELIVERY_EMAIL / DELIVERY_PASSWORD
 *   USER_EMAIL / USER_PASSWORD
 */

export enum Role {
    TENANT = "TENANT",
    SELLER = "SELLER",
    DELIVERY = "DELIVERY",
    USER = "USER",
}

export interface Credential {
    role: Role;
    email: string;
    password: string;
    tenant?: string;
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
        case Role.TENANT:
            return { role, email: required("TENANT_EMAIL"), password: required("TENANT_PASSWORD"), tenant: process.env.TENANT_NAME };
        case Role.SELLER:
            return { role, email: required("SELLER_EMAIL"), password: required("SELLER_PASSWORD"), tenant: required("SELLER_TENANT") };
        case Role.DELIVERY:
            return { role, email: required("DELIVERY_EMAIL"), password: required("DELIVERY_PASSWORD") };
        case Role.USER:
            return { role, email: required("USER_EMAIL"), password: required("USER_PASSWORD") };
        default:
            throw new Error(`Unknown role: ${role}`);
    }
}
