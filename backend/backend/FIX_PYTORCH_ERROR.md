# Fixing PyTorch DLL Error on Windows

## Error Message
```
OSError: [WinError 1114] A dynamic link library (DLL) initialization routine failed. 
Error loading "c10.dll" or one of its dependencies.
```

## Solutions

### Solution 1: Install Visual C++ Redistributables (Recommended)

This is the most common fix for this error.

1. **Download Visual C++ Redistributables:**
   - Go to: https://aka.ms/vs/17/release/vc_redist.x64.exe
   - Or search "Visual C++ Redistributable 2015-2022" on Microsoft website

2. **Install both versions:**
   - Install **x64** version
   - Install **x86** version (if available)

3. **Restart your computer**

4. **Try running the server again:**
   ```bash
   python main.py
   ```

### Solution 2: Reinstall PyTorch

If Solution 1 doesn't work, reinstall PyTorch:

```bash
# Uninstall current PyTorch
pip uninstall torch torchvision

# Reinstall PyTorch (CPU version - more stable on Windows)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Solution 3: Use CPU-Only PyTorch

If you don't need GPU support, use CPU-only version:

```bash
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Solution 4: Update Windows

Sometimes Windows updates fix DLL issues:

1. Go to Settings → Update & Security
2. Check for updates
3. Install any pending updates
4. Restart computer

### Solution 5: Use Alternative Installation Method

Try installing from conda-forge (if you have conda):

```bash
conda install pytorch torchvision -c pytorch
```

## Current Status

The backend has been updated to **handle PyTorch errors gracefully**. Even if PyTorch fails to load:

✅ **Server will still start**
✅ **OCR-based medicine scanning will work**
✅ **Rule-based visual diagnosis will work**
✅ **Only ML model features will be disabled**

You'll see a warning message but the server will continue running.

## Verify Fix

After applying a solution, test:

```bash
python -c "import torch; print('PyTorch works!')"
```

If this runs without error, PyTorch is fixed.

## Quick Test

Run the backend:
```bash
python main.py
```

You should see:
- ✅ Server starts successfully
- ⚠️ Warning about PyTorch (if not fixed)
- ✅ API endpoints available

The server will work with OCR/rule-based analysis even without PyTorch.

## Need Help?

If none of these solutions work:
1. Check Windows Event Viewer for more DLL errors
2. Try creating a fresh virtual environment
3. Consider using Docker for consistent environment
4. Check if antivirus is blocking DLL loading
