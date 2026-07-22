# Android Application APK Storage

Place your target Android application `.apk` file in this directory.

## Getting the App ID (Package Name)
To run Maestro tests, you must specify the target Application ID (Package Name). You can obtain this from your manager or extract it yourself from the APK file.

### How to extract the App ID using ADB:
1. Install your APK on an emulator or active device:
   ```bash
   adb install apps/your-app.apk
   ```
2. Open the app on the emulator/device.
3. Run the following command in terminal to check the package name of the active window:
   * **Windows (Command Prompt):**
     ```cmd
     adb shell dumpsys window | findstr mCurrentFocus
     ```
   * **macOS / Linux:**
     ```bash
     adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp'
     ```
4. Copy the package name (e.g. `com.nipige.qa.automation`) and update it inside:
   * [config/env.yaml](../config/env.yaml)
   * [run-tests.bat](../run-tests.bat)
