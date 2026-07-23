# PowerShell Test Runner with Cross-Device Support and Emulator Window Optimization
$ErrorActionPreference = "Continue"

# User-configurable emulator window target size (Width x Height) for desktop screen fitting
$EMULATOR_TARGET_WIDTH = 450
$EMULATOR_TARGET_HEIGHT = 900

# User-configurable local APK path for automatic installation on target devices if missing
$APK_PATH = "C:\Users\anura\Downloads\lirs-pos-agent-20-07-16-31 2.apk"
$APP_PACKAGE = "com.lirs.pos"

# Win32 API Helper function to dynamically resize the emulator window on the host computer desktop screen
function Resize-EmulatorWindow {
    param(
        [int]$Width = $EMULATOR_TARGET_WIDTH,
        [int]$Height = $EMULATOR_TARGET_HEIGHT
    )
    try {
        $code = @"
        using System;
        using System.Runtime.InteropServices;
        
        public class Win32 {
            [DllImport("user32.dll", SetLastError = true)]
            public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
        }
"@
        # Create Win32 Type mapping if not already registered in this PowerShell session
        if (-not ([System.Management.Automation.PSTypeName]'Win32').Type) {
            Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue | Out-Null
        }
        
        # Look for emulator processes (qemu-system-x86_64 or emulator)
        $processes = Get-Process | Where-Object { $_.ProcessName -like "*qemu-system*" -or $_.ProcessName -eq "emulator" }
        foreach ($p in $processes) {
            $hwnd = $p.MainWindowHandle
            if ($hwnd -ne [IntPtr]::Zero) {
                # Resize the emulator window to the target width and height
                $res = [Win32]::MoveWindow($hwnd, 100, 100, $Width, $Height, $true)
                if ($res) {
                    Write-Host "Automatically scaled emulator window to optimal desktop dimensions: $($Width)x$($Height)" -ForegroundColor Green
                }
            }
        }
    } catch {
        # Silently capture any window drawing race condition errors during startup
    }
}

# 1. Environment Validation
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "      Production Maestro Automation Test Runner" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Validating local system environment..." -ForegroundColor Yellow

# Locate Java JDK
$javaHome = $env:JAVA_HOME
if ([string]::IsNullOrEmpty($javaHome) -or -not (Test-Path $javaHome)) {
    $javaHome = 'C:\Users\anura\.jdks\openjdk-26.0.1'
    $env:JAVA_HOME = $javaHome
}
$env:Path += ";$javaHome\bin"

# Locate Android SDK & Emulator
$androidHome = $env:ANDROID_HOME
if ([string]::IsNullOrEmpty($androidHome) -or -not (Test-Path $androidHome)) {
    $androidHome = 'D:\Android\Sdk'
    $env:ANDROID_HOME = $androidHome
}
$env:Path += ";$androidHome\platform-tools;$androidHome\emulator"

# Locate Maestro
$env:Path += ';C:\Users\anura\Downloads\maestro\maestro\bin'

# Perform binary dependency checks
$javaOk = Get-Command "java" -ErrorAction SilentlyContinue
$adbOk = Get-Command "adb" -ErrorAction SilentlyContinue
$emulatorOk = Get-Command "emulator" -ErrorAction SilentlyContinue
$maestroOk = Get-Command "maestro" -ErrorAction SilentlyContinue

Write-Host "Java Development Kit   : " -NoNewline
if ($javaOk) { 
    # Force convert to string to avoid ErrorRecord type exceptions
    $javaVer = "$((java -version 2>&1 | Select-Object -First 1))".Trim()
    Write-Host "FOUND ($javaVer)" -ForegroundColor Green 
} else { 
    Write-Host "MISSING" -ForegroundColor Red 
}

Write-Host "Android Platform Tool  : " -NoNewline
if ($adbOk) { 
    $adbVer = (adb --version | Select-String -Pattern "version" | Select-Object -First 1).Line.Trim()
    Write-Host "FOUND ($adbVer)" -ForegroundColor Green 
} else { 
    Write-Host "MISSING" -ForegroundColor Red 
}

Write-Host "Android Emulator CLI   : " -NoNewline
if ($emulatorOk) { 
    Write-Host "FOUND" -ForegroundColor Green 
} else { 
    Write-Host "MISSING" -ForegroundColor Red 
}

Write-Host "Maestro Automation CLI : " -NoNewline
if ($maestroOk) { 
    Write-Host "FOUND ($(maestro --version))" -ForegroundColor Green 
} else { 
    Write-Host "MISSING" -ForegroundColor Red 
}

if (-not ($javaOk -and $adbOk -and $emulatorOk -and $maestroOk)) {
    Write-Host "`n[ERROR] Prerequisites validation failed! Please check your path variables." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}
Write-Host "All prerequisites validated successfully!`n" -ForegroundColor Green

# 2. Device Detection and Auto-Launch Loop
$selectedDevice = $null

while ($null -eq $selectedDevice) {
    Write-Host "Checking for connected Android devices..." -ForegroundColor Yellow
    $deviceLines = adb devices | Select-String -Pattern "\tdevice$"
    $devices = @()

    foreach ($line in $deviceLines) {
        $serial = $line.Line.Split("`t")[0].Trim()
        
        # Query properties safely (checking for null/empty values during emulator initialization)
        $modelVal = adb -s $serial shell getprop ro.product.model
        $model = if ($null -ne $modelVal) { "$modelVal".Trim() } else { "" }
        
        $versionVal = adb -s $serial shell getprop ro.build.version.release
        $version = if ($null -ne $versionVal) { "$versionVal".Trim() } else { "" }
        
        $characteristicsVal = adb -s $serial shell getprop ro.build.characteristics
        $characteristics = if ($null -ne $characteristicsVal) { "$characteristicsVal".Trim() } else { "" }
        
        # Identify type
        $isEmulator = $serial.StartsWith("emulator-") -or `
                      $serial.Contains("127.0.0.1") -or `
                      $serial.Contains("localhost") -or `
                      $characteristics.Contains("emulator") -or `
                      $model.Contains("Emulator") -or `
                      $model.Contains("Android SDK")
                      
        $type = if ($isEmulator) { "Emulator" } else { "Physical Device" }
        
        $devices += [PSCustomObject]@{
            Serial  = $serial
            Model   = $model
            Version = $version
            Type    = $type
        }
    }

    if ($devices.Count -gt 0) {
        # 3. Route Device Target selection
        if ($devices.Count -eq 1) {
            $selectedDevice = $devices[0]
            # Verify and try resizing if it's a running emulator
            if ($selectedDevice.Type -eq "Emulator") {
                Resize-EmulatorWindow
            }
        } else {
            # If multiple devices, check if exactly one physical device is connected to auto-prefer
            $physicalDevices = $devices | Where-Object { $_.Type -eq "Physical Device" }
            if ($physicalDevices.Count -eq 1) {
                $selectedDevice = $physicalDevices[0]
                Write-Host "Multiple devices detected. Auto-routing to the connected physical device: $($selectedDevice.Model)" -ForegroundColor Green
            } else {
                Write-Host "Multiple devices connected. Please choose target device:" -ForegroundColor Yellow
                for ($i = 0; $i -lt $devices.Count; $i++) {
                    $dev = $devices[$i]
                    Write-Host "[$($i + 1)] Model: $($dev.Model) | Type: $($dev.Type) | Version: Android $($dev.Version) | Serial: $($dev.Serial)"
                }
                Write-Host ""
                do {
                    $choice = Read-Host "Enter choice (1-$($devices.Count))"
                    if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $devices.Count) {
                        $selectedDevice = $devices[[int]$choice - 1]
                        if ($selectedDevice.Type -eq "Emulator") {
                            Resize-EmulatorWindow
                        }
                    } else {
                        Write-Host "Invalid choice. Please select a valid number." -ForegroundColor Red
                    }
                } while ($null -eq $selectedDevice)
            }
        }
    } else {
        # 4. No connected devices -> Search AVDs and launch emulator
        Write-Host "No connected Android devices found." -ForegroundColor Yellow
        Write-Host "Querying configured Android Virtual Devices (AVDs)..." -ForegroundColor Yellow
        
        # Get AVD names
        $avdOutput = & "emulator" -list-avds
        $avds = @()
        foreach ($avd in $avdOutput) {
            if (-not [string]::IsNullOrEmpty($avd.Trim())) {
                $avds += $avd.Trim()
            }
        }
        
        if ($avds.Count -eq 0) {
            Write-Host "`n[ERROR] No connected devices and no configured AVD emulators found!" -ForegroundColor Red
            Write-Host "Please create an emulator in Android Studio Device Manager or connect a physical device." -ForegroundColor Yellow
            Read-Host "Press Enter to exit..."
            exit 1
        }
        
        # Select and start emulator AVD
        $targetAvd = $null
        if ($avds.Count -eq 1) {
            $targetAvd = $avds[0]
            Write-Host "Automatically launching configured AVD emulator: $targetAvd..." -ForegroundColor Green
        } else {
            Write-Host "Available Virtual Devices:" -ForegroundColor Yellow
            for ($i = 0; $i -lt $avds.Count; $i++) {
                Write-Host "[$($i + 1)] $($avds[$i])"
            }
            do {
                $choice = Read-Host "Choose an emulator to launch (1-$($avds.Count))"
                if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $avds.Count) {
                    $targetAvd = $avds[[int]$choice - 1]
                } else {
                    Write-Host "Invalid choice." -ForegroundColor Red
                }
            } while ($null -eq $targetAvd)
        }
        
        # Launch emulator process cleanly in background if not already running
        $emulatorProcess = Get-Process | Where-Object { $_.ProcessName -like "*qemu-system*" -or $_.ProcessName -eq "emulator" }
        if (-not $emulatorProcess) {
            Write-Host "Starting emulator '$targetAvd' with clean state (-no-snapshot)..." -ForegroundColor Green
            Start-Process -FilePath "emulator" -ArgumentList "-avd $targetAvd -no-snapshot" -NoNewWindow -RedirectStandardOutput "$env:TEMP\emu_out.log" -RedirectStandardError "$env:TEMP\emu_err.log"
        } else {
            Write-Host "Emulator process is already running. Waiting for ADB registration..." -ForegroundColor Yellow
        }
        
        # Loop and wait for the new emulator device to register under ADB
        Write-Host "Waiting for the emulator process to register under ADB..." -ForegroundColor Yellow
        $detected = $false
        $timeout = 0
        while (-not $detected -and $timeout -lt 45) {
            Start-Sleep -Seconds 2
            $detectedLines = adb devices | Select-String -Pattern "\t(device|offline|unauthorized)$"
            if ($detectedLines) {
                $detected = $true
            }
            $timeout++
            # Dynamically attempt to apply window scale parameters once it registers
            Resize-EmulatorWindow
        }
        
        if (-not $detected) {
            Write-Host "[ERROR] Launched emulator failed to connect to ADB within 90 seconds." -ForegroundColor Red
            Read-Host "Press Enter to exit..."
            exit 1
        }
    }
}

# 5. Wait for target device boot complete status
Write-Host "Verifying device boot status..." -ForegroundColor Yellow
$booted = $false
$attempts = 0
$maxAttempts = 45

while (-not $booted -and $attempts -lt $maxAttempts) {
    try {
        $status = (adb -s $selectedDevice.Serial shell getprop sys.boot_completed).Trim()
        if ($status -eq "1") {
            $booted = $true
        }
    } catch {
        # Suppress query exceptions during startup resets
    }
    if (-not $booted) {
        $attempts++
        Start-Sleep -Seconds 2
    }
}

if (-not $booted) {
    Write-Host "[WARNING] Device boot verification timed out! Attempting to proceed..." -ForegroundColor Yellow
} else {
    Write-Host "Device is booted and ready for test execution!" -ForegroundColor Green
}

# Apply window resize safety check
if ($selectedDevice.Type -eq "Emulator") {
    Resize-EmulatorWindow
}

# Dismiss potential startup system crash dialogs/overlays (e.g. System UI / Pixel Launcher hangs)
Write-Host "Dismissing potential startup system overlays via ADB..." -ForegroundColor Yellow
for ($i = 0; $i -lt 3; $i++) {
    try {
        adb -s $selectedDevice.Serial shell input keyevent 4 | Out-Null
    } catch {}
    Start-Sleep -Milliseconds 500
}

# 5.5 Check if application package is installed on the target device
Write-Host "Checking if package '$APP_PACKAGE' is installed on $($selectedDevice.Model)..." -ForegroundColor Yellow
$packageCheck = ""
try {
    $packageCheck = (adb -s $selectedDevice.Serial shell pm list packages $APP_PACKAGE).Trim()
} catch {
    # Suppress shell listing errors on early startup
}

if ([string]::IsNullOrEmpty($packageCheck)) {
    Write-Host "[WARNING] Package '$APP_PACKAGE' is NOT installed on this device!" -ForegroundColor Red
    if (Test-Path $APK_PATH) {
        Write-Host "Local APK found at: $APK_PATH" -ForegroundColor Green
        Write-Host "Installing APK onto the device. Please wait..." -ForegroundColor Yellow
        $installResult = adb -s $selectedDevice.Serial install "$APK_PATH"
        Write-Host $installResult
        
        # Verify installation again
        $packageCheckAfter = ""
        try {
            $packageCheckAfter = (adb -s $selectedDevice.Serial shell pm list packages $APP_PACKAGE).Trim()
        } catch {}
        
        if ([string]::IsNullOrEmpty($packageCheckAfter)) {
            Write-Host "[ERROR] Installation failed. Please install the APK manually on your device." -ForegroundColor Red
            Read-Host "Press Enter to exit..."
            exit 1
        } else {
            Write-Host "Application installed successfully!" -ForegroundColor Green
        }
    } else {
        Write-Host "[ERROR] Local APK file not found at: $APK_PATH" -ForegroundColor Red
        Write-Host "Please install the app manually on your phone, or configure `$APK_PATH at the top of the runner script." -ForegroundColor Yellow
        Read-Host "Press Enter to exit..."
        exit 1
    }
} else {
    Write-Host "Application package is already installed on the device." -ForegroundColor Green
}

# 6. Select Target Environment config
$envFile = $null
$envName = $null
do {
    Write-Host "`nSelect Target Environment:"
    Write-Host "[1] QA Environment"
    Write-Host "[2] UAT Environment"
    Write-Host "[3] Production Environment"
    Write-Host ""
    $envChoice = Read-Host "Enter choice (1-3)"
    if ($envChoice -eq "1") { $envFile = "config\qa.yaml"; $envName = "QA" }
    elseif ($envChoice -eq "2") { $envFile = "config\uat.yaml"; $envName = "UAT" }
    elseif ($envChoice -eq "3") { $envFile = "config\prod.yaml"; $envName = "Production" }
    else { Write-Host "Invalid choice. Please try again." -ForegroundColor Red }
} while ($null -eq $envFile)

# 7. Select Test Level flow
$flowPath = $null
$suiteName = $null
do {
    Write-Host "`nSelect Test Execution Level:"
    Write-Host "[1] Smoke Tests (flows\smoke\)"
    Write-Host "[2] Sanity Tests (flows\sanity\)"
    Write-Host "[3] Regression Tests (flows\regression\)"
    Write-Host ""
    $flowChoice = Read-Host "Enter choice (1-3)"
    if ($flowChoice -eq "1") { $flowPath = "flows\smoke\"; $suiteName = "Smoke" }
    elseif ($flowChoice -eq "2") { $flowPath = "flows\sanity\"; $suiteName = "Sanity" }
    elseif ($flowChoice -eq "3") { $flowPath = "flows\regression\"; $suiteName = "Regression" }
    else { Write-Host "Invalid choice. Please try again." -ForegroundColor Red }
} while ($null -eq $flowPath)

# 8. Display Execution Summary panel
Write-Host "`n==========================================" -ForegroundColor Green
Write-Host " Selected Device : $($selectedDevice.Model)"
Write-Host " Device Type     : $($selectedDevice.Type)"
Write-Host " Android Version : $($selectedDevice.Version)"
Write-Host " Device Serial   : $($selectedDevice.Serial)"
Write-Host " Environment     : $envName"
Write-Host " Test Suite      : $suiteName"
Write-Host "==========================================" -ForegroundColor Green

# 9. Configure test outputs and folders
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$reportDir = "reports\$timestamp"
$logFile = "logs\$($timestamp)_run.log"

New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "[RUNNING] Device   : $($selectedDevice.Serial) ($($selectedDevice.Type))" -ForegroundColor Green
Write-Host "[RUNNING] Env Config: $envFile"
Write-Host "[RUNNING] Test Path : $flowPath"
Write-Host "[RUNNING] Log File  : $logFile"
Write-Host "==================================================`n" -ForegroundColor Cyan

# 10. Parse environment variables from the selected configuration YAML file for Maestro 2.7.0 compatibility
$envArgs = @()
if (Test-Path $envFile) {
    $lines = Get-Content $envFile
    foreach ($line in $lines) {
        $line = $line.Trim()
        # Skip blank lines and comments
        if ([string]::IsNullOrEmpty($line) -or $line.StartsWith("#")) {
            continue
        }
        # Parse KEY: "VALUE"
        if ($line -match '^([^:]+):\s*(.*)$') {
            $key = $Matches[1].Trim()
            $val = $Matches[2].Trim()
            # Strip outer single/double quotes from value
            $val = $val -replace '^"|"$', ''
            $val = $val -replace "^'|'$", ""
            $envArgs += "--env `"$key=$val`""
        }
    }
}
$envString = $envArgs -join " "

# 11. Execute Maestro test suite with target device binding and env options
$cmd = "maestro test $flowPath --device $($selectedDevice.Serial) $envString --format JUNIT --output $reportDir\report.xml --test-output-dir $reportDir"

# Run command and write outputs to console + file dynamically
Invoke-Expression $cmd | Tee-Object -FilePath $logFile

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "[COMPLETED] Reports saved to: $reportDir\report.xml"
Write-Host "[COMPLETED] Failure Screenshots (if any): $reportDir\screenshots\"
Write-Host "[COMPLETED] Execution Logs saved to: $logFile"
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit..."
