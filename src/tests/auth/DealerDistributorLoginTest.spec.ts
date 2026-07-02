import HomeSteps from "@uiSteps/HomeSteps";
import { test } from "@base-test";
import Allure from "@allure";
import { getCredential, Role } from "@config/Credentials";

/**
 * Persona coverage for the Dealer and Distributor "Login as" roles on the Nipige login screen.
 *
 * Credentials come from .env (DEALER_EMAIL/DEALER_PASSWORD, DISTRIBUTOR_EMAIL/DISTRIBUTOR_PASSWORD —
 * see .env.example). Until those accounts are provisioned the tests self-skip, so the suite stays
 * green while making the missing persona coverage visible in the report.
 *
 * If either persona turns out to be tenant-scoped (the login screen shows a "Select Tenant"
 * dropdown after picking the role), add an entry to HomePage.PERSONA_TENANTS — no other change
 * is needed (see the Seller persona for the pattern).
 */
const personas = [
    { role: Role.DEALER, persona: "dealer", envKey: "DEALER_EMAIL" },
    { role: Role.DISTRIBUTOR, persona: "distributor", envKey: "DISTRIBUTOR_EMAIL" },
];

personas.forEach(({ role, persona, envKey }) => {
    test(`${role}_ValidLogin - Verify login via the "Login as" ${persona} role @regression @auth`,
        async ({ page }) => {
            test.skip(!process.env[envKey],
                `${envKey} not set in .env — provision a ${persona} account to enable this persona's coverage`);
            Allure.attachDetails(`Verify a ${persona} account can log in and reach its dashboard`, null);

            const creds = getCredential(role);
            const home = new HomeSteps(page);
            await home.launchApplication();
            await home.login(creds.email, creds.password, persona);
            await home.validateLogin(creds.email);
            await home.logout();
        });
});
