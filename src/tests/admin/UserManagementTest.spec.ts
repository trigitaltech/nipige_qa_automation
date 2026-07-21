import { test } from "@base-test";

import HomeSteps from "@uiSteps/HomeSteps";
import UserManagementSteps from "@uiSteps/UserManagementSteps";

import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "UserManagement";

const testCases = [
    "TC01_PageLoad",
    "TC02_SearchUserPositive",
    "TC03_SearchUserByEmail",
    "TC04_SearchUserNegative",
    "TC06_VerifyTabs",
    "TC07_ViewUserDetails",
    "TC08_EditUser",
    "TC09_DeleteUser",
    "TC10_CreateUser"
];

for (const testCase of testCases) {

    const data = ExcelUtil.getTestData(
        SHEET,
        testCase
    );

    test(`${data.TestID} - ${data.Description} @regression @admin`,

        async ({ page }) => {

            const home =
                new HomeSteps(page);

            const userManagement =
                new UserManagementSteps(page);

            // Inject getter/setter hooks to hijack Google Maps Autocomplete when the library loads dynamically
            await page.addInitScript(() => {
                let realGoogle: any = undefined;
                
                Object.defineProperty(window, "google", {
                    get() {
                        return realGoogle;
                    },
                    set(val) {
                        realGoogle = val;
                        if (realGoogle) {
                            let realMaps = realGoogle.maps;
                            Object.defineProperty(realGoogle, "maps", {
                                get() {
                                    return realMaps;
                                },
                                set(mapsVal) {
                                    realMaps = mapsVal;
                                    if (realMaps) {
                                        realMaps.event = realMaps.event || {};
                                        const origListener = realMaps.event.addListener;
                                        realMaps.event.addListener = function(instance: any, eventName: string, handler: Function) {
                                            if (instance && instance.listeners) {
                                                instance.listeners[eventName] = instance.listeners[eventName] || [];
                                                instance.listeners[eventName].push(handler);
                                                return { remove: () => {} };
                                            }
                                            return origListener ? origListener.apply(this, arguments) : { remove: () => {} };
                                        };
                                        
                                        let realPlaces = realMaps.places;
                                        Object.defineProperty(realMaps, "places", {
                                            get() {
                                                return realPlaces;
                                            },
                                            set(placesVal) {
                                                realPlaces = placesVal;
                                                if (realPlaces) {
                                                    setupMockAutocomplete(realPlaces);
                                                }
                                            },
                                            configurable: true
                                        });
                                        if (realPlaces) {
                                            setupMockAutocomplete(realPlaces);
                                        }
                                    }
                                },
                                configurable: true
                            });
                            if (realMaps) {
                                realGoogle.maps = realMaps;
                            }
                        }
                    },
                    configurable: true
                });
                
                function setupMockAutocomplete(places: any) {
                    (window as any)._mockAutocompletes = (window as any)._mockAutocompletes || [];
                    
                    const mockLat = () => 16.7121;
                    mockLat.toString = () => "16.7121";
                    mockLat.valueOf = () => 16.7121;
                    
                    const mockLng = () => 81.1029;
                    mockLng.toString = () => "81.1029";
                    mockLng.valueOf = () => 81.1029;
                    
                    const mockLatLng = {
                        lat: mockLat,
                        lng: mockLng
                    };
                    
                    places.Autocomplete = class MockAutocomplete {
                        element: HTMLInputElement;
                        listeners: { [key: string]: Function[] } = {};
                        
                        constructor(element: HTMLInputElement) {
                            this.element = element;
                            (window as any)._mockAutocompletes.push(this);
                            element.addEventListener("focus", () => {
                                setTimeout(() => {
                                    this.triggerSelect();
                                }, 500);
                            });
                        }
                        
                        addListener(event: string, callback: Function) {
                            this.listeners[event] = this.listeners[event] || [];
                            this.listeners[event].push(callback);
                        }
                        
                        getPlace() {
                            return {
                                formatted_address: this.element.value || "Eluru, Andhra Pradesh, India",
                                geometry: {
                                    location: mockLatLng
                                },
                                address_components: [
                                    { long_name: "Eluru", short_name: "Eluru", types: ["locality"] },
                                    { long_name: "Andhra Pradesh", short_name: "AP", types: ["administrative_area_level_1"] },
                                    { long_name: "India", short_name: "IN", types: ["country"] }
                                ]
                            };
                        }
                        
                        triggerSelect() {
                            if (this.listeners["place_changed"]) {
                                this.listeners["place_changed"].forEach(cb => cb());
                            }
                        }
                    };
                    
                    places.AutocompleteService = class MockAutocompleteService {
                        getPlacePredictions(request: any, callback: any) {
                            callback([
                                {
                                    description: "Eluru, Andhra Pradesh, India",
                                    place_id: "mock-place-id-eluru",
                                    structured_formatting: {
                                        main_text: "Eluru",
                                        secondary_text: "Andhra Pradesh, India"
                                    },
                                    types: ["locality", "political"]
                                }
                            ], "OK");
                        }
                    };
                    
                    places.PlacesService = class MockPlacesService {
                        constructor() {}
                        getDetails(request: any, callback: any) {
                            callback({
                                formatted_address: "Eluru, Andhra Pradesh, India",
                                geometry: {
                                    location: mockLatLng
                                },
                                address_components: [
                                    { long_name: "Eluru", short_name: "Eluru", types: ["locality"] },
                                    { long_name: "Andhra Pradesh", short_name: "AP", types: ["administrative_area_level_1"] },
                                    { long_name: "India", short_name: "IN", types: ["country"] }
                                ]
                            }, "OK");
                        }
                    };
                    
                    const maps = (window as any).google.maps;
                    if (maps) {
                        maps.LatLng = class MockLatLng {
                            constructor(latVal: number, lngVal: number) {
                                return mockLatLng;
                            }
                        };
                        maps.Geocoder = class MockGeocoder {
                            geocode(request: any, callback: any) {
                                callback([{
                                    formatted_address: "Eluru, Andhra Pradesh, India",
                                    geometry: {
                                        location: mockLatLng
                                    }
                                }], "OK");
                            }
                        };
                    }
                }
            });

            await home.launchApplication();

            await home.login(
                data.UserName,
                data.Password,
                data.persona
            );

            await home.validateLogin(data.UserName);

            await userManagement.openUserManagementPage();

            switch (testCase) {

                case "TC01_PageLoad":

                    await userManagement.verifyPageLoaded();

                    break;

                case "TC02_SearchUserPositive":

                case "TC03_SearchUserByEmail":

                case "TC04_SearchUserNegative":

                    await userManagement.searchUser(
                        data.SearchText,
                        data.ExpectedResult
                    );

                    break;

                case "TC06_VerifyTabs":

                    await userManagement.verifyTabs();

                    break;

                case "TC07_ViewUserDetails":

                    await userManagement.viewUserDetails(
                        data.SearchText
                    );

                    break;

                case "TC08_EditUser":

                    await userManagement.editUser(
                        data.SearchText,
                        data.UpdatedName
                    );

                    break;

                case "TC09_DeleteUser":

                    await userManagement.deleteUser(
                        data.SearchText
                    );

                    break;

                case "TC10_CreateUser": {
                    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
                    data.Email = `dilinsing${randomSuffix}@yopmail.com`;
                    data.UserLogin = `SingDolin${randomSuffix}`;
                    data.Phone = `9999${randomSuffix}`;
                    data.Address = "Eluru, Andhra Pradesh, India";

                    await userManagement.createUser(data);

                    break;
                }
            }

            await home.logout();
        }
    );
}