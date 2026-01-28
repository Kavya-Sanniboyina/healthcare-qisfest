# Fix PyTorch DLL Error for Training Scripts

## Quick Fix (Recommended)

Run the batch file:
```bash
.\fix_pytorch_training.bat
```

This will:
1. Uninstall current PyTorch
2. Install CPU-only version (more stable)
3. Test if it works

## Manual Fix

### Option 1: Install Visual C++ Redistributables (Most Common Fix)

1. **Download:**
   - Go to: https://aka.ms/vs/17/release/vc_redist.x64.exe
   - Or search "Visual C++ Redistributable 2015-2022" on Microsoft website

2. **Install:**
   - Run the installer
   - Restart your computer

3. **Test:**
   ```bash
   python -c "import torch; print('Works!')"
   ```

### Option 2: Reinstall PyTorch CPU Version

```bash
# Uninstall current version
pip uninstall torch torchvision -y

# Install CPU-only version (more stable on Windows)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Test
python -c "import torch; print('Works!')"
```

### Option 3: Use Conda (If Available)

```bash
conda install pytorch torchvision -c pytorch
```

## Verify Fix

After applying a fix, test:

```bash
python -c "import torch; print(f'PyTorch {torch.__version__} is working!')"
```

If no error, PyTorch is fixed!

## Run Training Scripts

Once PyTorch is fixed:

```bash
# Train medicine model
python train_medicine_model.py

# Train skin model
python train_skin_model.py
```

## Important Notes

1. **Training is Optional**
   - The system works without trained models
   - Uses OCR for medicines and rule-based for diagnosis
   - Training improves accuracy but is not required

2. **If Training Fails**
   - You can still use the system
   - Backend will use fallback methods
   - Train models later when PyTorch is fixed

3. **CPU vs GPU**
   - CPU version is more stable on Windows
   - GPU version requires CUDA (more complex)
   - For training, CPU is fine (just slower)

## Troubleshooting

### Still Getting DLL Error?

1. **Check Windows Updates**
   - Install all pending Windows updates
   - Restart computer

2. **Check Antivirus**
   - Temporarily disable antivirus
   - Some antivirus block DLL loading

3. **Fresh Virtual Environment**
   ```bash
   # Create new venv
   python -m venv venv_new
   venv_new\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Check Python Version**
   - Use Python 3.8-3.11 (recommended)
   - Python 3.12+ may have compatibility issues

## Alternative: Skip Training

If you can't fix PyTorch right now:

1. **System Still Works**
   - Backend uses OCR/rule-based methods
   - All features functional
   - Just lower accuracy

2. **Train Later**
   - Fix PyTorch when convenient
   - Train models later
   - Models will auto-load when available

## Summary

**Quick Fix:**
```bash
.\fix_pytorch_training.bat
```

**Or Manual:**
1. Install Visual C++ Redistributables
2. Reinstall PyTorch CPU version
3. Test and run training

**Remember:** Training is optional - the system works without it!
