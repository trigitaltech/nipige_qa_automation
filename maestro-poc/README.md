# Maestro Mobile Automation Framework (Production Upgraded)

This is a standalone, production-ready mobile UI automation framework for Android applications using **Maestro**. It is completely separate from the Playwright web automation project.

---

## 🏗️ Project Architecture

```text
       Android APK (Target Application)
                 ↓
       Maestro Automation Engine (executing flows via ADB)
                 ↓
       Reusable Screen-Object Subflows (login.yaml, logout.yaml, etc.)
                 ↓
       Main Test Flows (smoke, sanity, regression tests)
                 ↓
       Timestamped Execution Folders (reports/ & logs/ generated automatically)
                 ↓ 
       Screenshots (Failure capture PNG files generated on test error)
```

---

## 📂 Folder Structure

Here is a breakdown of the production folder architecture:

* **`config/`** - Configuration profiles.
  * `config.yaml` - Global workspace config containing the default package `appId`.
  * `qa.yaml`, `uat.yaml`, `prod.yaml` - Environmental target variables (package IDs, URLs, testing credentials).
* **`data/`** - Reusable test data.
  * `users.json` - Organized credentials mapping tenant and platform admin logins for different environments.
* **`flows/`** - Test scenario cases categorized by depth:
  * `smoke/` - Fast smoke tests checking app launch and credentials.
  * `sanity/` - Basic functionality check (navigating dashboards).
  * `regression/` - In-depth feature checks (editing parameters).
* **`subflows/`** - Modular reusable blocks (Page Object equivalents) segmented by application screens:
  * `common/` - Utilities like app initialization (`launch.yaml`).
  * `auth/` - Authentication interactions (`login.yaml`, `logout.yaml`).
  * `navigation/` - Core tab navigations (`navigate_home.yaml`).
* **`reports/`** - Dynamically generated execution outputs (JUnit XML reports and failure screenshots organized by timestamp folders: `YYYY-MM-DD_HH-MM`).
* **`logs/`** - Dynamically generated text logs capturing full CLI terminal outputs.
* **`run-tests.bat`** - Interactive Windows test runner providing menu selections.

---

## 🛠️ Step-by-Step Installation Guide

### 1. Java Setup
Maestro CLI and Android command-line tools require Java.
* **Download & Install:** Download OpenJDK 17 or 21 LTS from [Adoptium (Temurin)](https://adoptium.net/).
* **Environment Variables:**
  * Add a system variable named `JAVA_HOME` pointing to your Java installation folder (e.g., `C:\Program Files\Eclipse Foundation\jdk-17.0.x`).
  * Add `%JAVA_HOME%\bin` to your system `Path`.

### 2. Android Studio & SDK Setup
Provides the SDK tools, ADB command line, and emulator.
* **Download & Install:** Install Android Studio from [developer.android.com](https://developer.android.com/studio).
* **Install Android SDK Platforms:**
  * Open Android Studio -> Tools -> SDK Manager.
  * Under **SDK Platforms**, check **Android 14 (API 34)** or higher and click **Apply** to install.
* **Environment Variables:**
  * Add a system variable `ANDROID_HOME` pointing to your SDK path (typically `C:\Users\<username>\AppData\Local\Android\Sdk`).
  * Add the following subdirectories to your system `Path`:
    * `%ANDROID_HOME%\platform-tools` (Contains `adb.exe`)
    * `%ANDROID_HOME%\cmdline-tools\latest\bin`
    * `%ANDROID_HOME%\emulator`

### 3. Android Emulator Setup
* Open Android Studio -> Tools -> Device Manager.
* Click **Create Device** (e.g., choose Pixel 7, click Next).
* Select a System Image (e.g., API 34 with Google APIs), download, and click Finish.
* Launch the emulator from the Device Manager list.

### 4. Maestro CLI Setup
* **Windows (Git Bash or PowerShell):**
  Run in PowerShell as Administrator:
  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://get.maestro.mobile.dev/install.ps1'))
  ```

---

## 🔍 Verification Commands

Open a new command prompt or terminal and run the following:

| Component | Verification Command | Expected Output |
| :--- | :--- | :--- |
| **Java** | `java -version` | `openjdk version "17.0.x" ...` |
| **ADB** | `adb --version` | `Android Debug Bridge version 1.0.x` |
| **Emulator Devices** | `adb devices` | Lists active emulators (e.g., `emulator-5554 device`) |
| **Maestro** | `maestro --version` | Displays Maestro CLI version (e.g., `1.37.x`) |

---

## 🏃‍♂️ Test Execution

### A. Windows Test Runner Menu (Easiest)
1. Double-click **`run-tests.bat`**.
2. Select your environment (1: QA, 2: UAT, 3: Prod).
3. Select your test execution level (1: Smoke, 2: Sanity, 3: Regression).
4. The runner will automatically stream the execution to your console, save detailed logs, and output reports.

### B. Command Line Execution (CI / Manual)
Run the following from the `maestro-poc/` root folder:
```bash
maestro --env-file config/qa.yaml test flows/smoke/ --format junit --out reports/report.xml --screenshot-on-failure-dir reports/screenshots
```

---

## 🛠️ Troubleshooting Guide

### 1. "No devices found / Emulator offline"
* **Solution:** Run `adb devices`. If your emulator is not listed or shown as `offline`, restart the emulator in Android Studio (cold boot) or run:
  ```bash
  adb kill-server
  adb start-server
  ```

### 2. "Unable to move cache / Access is denied"
* **Solution:** Ensure you don't have multiple instances of Maestro or Emulator debug channels locking the same memory port. Close other command prompts and restart your emulator.

### 3. "Input fields not being populated"
* **Solution:** Maestro relies on accessibility nodes. If `inputText` fails, verify that your subflow uses the exact `id` (resource-id) matching the layout rather than a generic text index.

---

## 📘 Reusable Maestro Best Practices

1. **Accessibility IDs over Text:** Always use `id: "username_input"` instead of text searches when interacting with form input fields. It prevents tests from breaking during translations.
2. **Page Object Model (Screen Objects):** Break down screens into individual files under `subflows/`. Do not write raw tap actions inside the test `flows/` directly. 
3. **No Hardcoded Pauses:** Avoid using `sleep: 5000`. Instead, assert visibility of target nodes (`assertVisible: "Home"`) to allow tests to continue dynamically.
4. **Environment Isolation:** Use `--env-file` profiles for credentials instead of defining usernames inside test flows.
