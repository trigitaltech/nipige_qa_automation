export default class HomePage {
    static readonly SIGN_IN_ERROR_MESSAGE = "#signInResultMessage.invalid";
    static readonly NIPIGE_EMAIL_TEXTBOX = "input[name='email'], input[name='username'], input[type='email'], input[placeholder*='Email'], input[placeholder*='company'], input[type='text']";
    static readonly NIPIGE_PASSWORD_TEXTBOX = "input[name='password'], input[type='password'], input[placeholder*='Password']";
    static readonly NIPIGE_SELLER_ROLE_BUTTON = "button:has-text('Seller')";
    static readonly NIPIGE_ADMIN_ROLE_BUTTON = "button:has-text('Admin'), button:has-text('Buyer'), button:has-text('Tenant'), button:has-text('Delivery Agent')";
    static readonly NIPIGE_LOGIN_BUTTON = "button:has-text('Log in')";
    static readonly NIPIGE_LOGIN_HEADING = "text=Login to your account";
    static readonly NIPIGE_LOGIN_ERROR = "[role='alert'], .Toastify__toast--error, .ant-message-error, .text-danger, .error, .alert-danger, .login-error, [class*='error-message'], [class*='invalid-feedback'], .text-red-500, p.text-red, span.text-red";
    static readonly NIPIGE_ORDER_MANAGEMENT_LINK = "text=Order Management";
    static readonly NIPIGE_ORDER_MANAGEMENT_STAT_CARD = "text=TOTAL ORDERS";
}
