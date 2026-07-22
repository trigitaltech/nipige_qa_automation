@echo off
setlocal enabledelayedexpansion
cls
echo ==================================================
echo      Production Maestro Automation Test Runner
echo ==================================================
echo.

:menu_env
echo Select Target Environment:
echo [1] QA Environment
echo [2] UAT Environment
echo [3] Production Environment
echo.
set /p env_choice="Enter choice (1-3): "

if "%env_choice%"=="1" (
    set ENV_FILE=config\qa.yaml
) else if "%env_choice%"=="2" (
    set ENV_FILE=config\uat.yaml
) else if "%env_choice%"=="3" (
    set ENV_FILE=config\prod.yaml
) else (
    echo [ERROR] Invalid choice. Please try again.
    echo.
    goto menu_env
)

:menu_flow
echo.
echo Select Test Execution Level:
echo [1] Smoke Tests (flows\smoke\)
echo [2] Sanity Tests (flows\sanity\)
echo [3] Regression Tests (flows\regression\)
echo.
set /p flow_choice="Enter choice (1-3): "

if "%flow_choice%"=="1" (
    set FLOW_PATH=flows\smoke\
) else if "%flow_choice%"=="2" (
    set FLOW_PATH=flows\sanity\
) else if "%flow_choice%"=="3" (
    set FLOW_PATH=flows\regression\
) else (
    echo [ERROR] Invalid choice. Please try again.
    echo.
    goto menu_flow
)

REM Generate Timestamp for execution folder
REM Extracting date components safely: YYYY-MM-DD_HH-MM
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a-%%b)
set RUN_ID=!mydate!_!mytime!
set RUN_ID=!RUN_ID: =0!

set REPORT_DIR=reports\!RUN_ID!
set LOG_FILE=logs\!RUN_ID!_run.log

REM Make sure folders exist
mkdir !REPORT_DIR! 2>nul
mkdir logs 2>nul

echo.
echo ==================================================
echo [RUNNING] Env Config: !ENV_FILE! 
echo [RUNNING] Test Path: !FLOW_PATH!
echo [RUNNING] Logging CLI output to: !LOG_FILE!
echo ==================================================
echo.

REM Running tests and streaming output to file + console via PowerShell
powershell -Command "$env:JAVA_HOME = 'C:\Users\anura\.jdks\openjdk-26.0.1'; $env:Path += ';C:\Users\anura\.jdks\openjdk-26.0.1\bin;C:\Users\anura\Downloads\maestro\maestro\bin;D:\Android\Sdk\platform-tools'; maestro --env-file !ENV_FILE! test !FLOW_PATH! --format JUNIT --output !REPORT_DIR!\report.xml --test-output-dir !REPORT_DIR! | Tee-Object -FilePath !LOG_FILE!"



echo.
echo ==================================================
echo [COMPLETED] Reports saved to: !REPORT_DIR!\report.xml
echo [COMPLETED] Screenshots on failure: !REPORT_DIR!\screenshots\
echo [COMPLETED] Execution Logs saved to: !LOG_FILE!
echo ==================================================
pause
