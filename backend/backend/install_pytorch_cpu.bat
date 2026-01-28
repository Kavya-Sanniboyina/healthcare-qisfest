@echo off
echo ========================================
echo Installing PyTorch CPU-only version
echo (More stable on Windows)
echo ========================================
echo.

echo Step 1: Uninstalling existing PyTorch...
pip uninstall torch torchvision -y
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Some packages may not have been uninstalled
)
echo.

echo Step 2: Installing PyTorch CPU version...
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Installation failed!
    echo.
    echo Please try:
    echo 1. Install Visual C++ Redistributables first
    echo 2. Check your internet connection
    echo 3. Run as administrator
    pause
    exit /b 1
)
echo.

echo Step 3: Testing installation...
python -c "import torch; print('SUCCESS: PyTorch', torch.__version__, 'is working!')"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: PyTorch installed but not working!
    echo.
    echo Please install Visual C++ Redistributables:
    echo https://aka.ms/vs/17/release/vc_redist.x64.exe
    echo.
    echo Then restart your computer and test again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation complete and verified!
echo ========================================
echo.
echo You can now:
echo - Run training scripts
echo - Use ML models in backend
echo.
pause
