@echo off
echo ========================================
echo Fixing PyTorch for Training Scripts
echo ========================================
echo.

echo Step 1: Uninstalling current PyTorch...
pip uninstall torch torchvision -y
echo.

echo Step 2: Installing PyTorch CPU version (more stable on Windows)...
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
echo.

echo Step 3: Testing PyTorch installation...
python -c "import torch; print('SUCCESS: PyTorch is working!'); print(f'Version: {torch.__version__}')"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: PyTorch still not working.
    echo.
    echo Please try:
    echo 1. Install Visual C++ Redistributables from:
    echo    https://aka.ms/vs/17/release/vc_redist.x64.exe
    echo 2. Restart your computer
    echo 3. Run this script again
    pause
    exit /b 1
)

echo.
echo ========================================
echo PyTorch is now fixed!
echo ========================================
echo.
echo You can now run:
echo   python train_medicine_model.py
echo   python train_skin_model.py
echo.
pause
