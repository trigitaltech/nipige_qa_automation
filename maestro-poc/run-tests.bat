@echo off
setlocal
cls

REM Navigate to the directory of this batch script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM Launch the upgraded PowerShell runner with dynamic device selection
powershell -NoProfile -ExecutionPolicy Bypass -File "run-tests.ps1"
