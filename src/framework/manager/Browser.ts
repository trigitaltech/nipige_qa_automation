import { BrowserName } from "@playwright/test";
import BrowserConstants from "../constants/BrowserConstants";

export default class Browser {
    public static type(browser: string): BrowserName {
        if (browser === BrowserConstants.FIREFOX) {
            return BrowserConstants.FIREFOX as BrowserName;
        } else if (browser === BrowserConstants.WEBKIT) {
            return BrowserConstants.WEBKIT as BrowserName;
        } else {
            return BrowserConstants.CHROMIUM as BrowserName;
        }
    }

    public static channel(browser: string) {
        let browserChannel;
        if (browser === BrowserConstants.CHROME) {
            browserChannel = BrowserConstants.CHROME;
        } else if (browser === BrowserConstants.EDGE) {
            browserChannel = BrowserConstants.MSEDGE;
        } else {
            browserChannel = BrowserConstants.BLANK;
        }
        return browserChannel;
    }
}
