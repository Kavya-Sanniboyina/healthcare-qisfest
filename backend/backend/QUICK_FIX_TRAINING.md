# Quick Fix for Training Scripts PyTorch Error

## The Problem

You're getting this error when running training scripts:
```
OSError: [WinError 1114] A dynamic link library (DLL) initialization routine failed
```

## The Solution (Choose One)

### 🚀 Fastest: Run Batch File

```bash
.\fix_pytorch_training.bat
```

This automatically:
- Uninstalls broken PyTorch
- Installs working CPU version
- Tests if it works

### 📥 Option 1: Install Visual C++ Redistributables

**This fixes 90% of cases:**

1. Download: https://aka.ms/vs/17/release/vc_redist.x64.exe
2. Install it
3. Restart computer
4. Test: `python -c "import torch; print('Works!')"`

### 🔄 Option 2: Reinstall PyTorch

```bash
pip uninstall torch torchvision -y
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
python -c "import torch; print('Works!')"
```

## After Fixing

Run training scripts:
```bash
python train_medicine_model.py
python train_skin_model.py
```

## Important Note

**Training is OPTIONAL!**

- ✅ System works without trained models
- ✅ Uses OCR for medicines
- ✅ Uses rule-based for diagnosis
- ✅ All features functional
- ⚠️ Just lower accuracy without ML models

You can:
1. Fix PyTorch now and train models
2. Use system as-is (works fine)
3. Fix PyTorch later when convenient

## Still Not Working?

1. Check Windows is updated
2. Restart computer
3. Try fresh virtual environment
4. Check antivirus isn't blocking

See `TRAINING_PYTORCH_FIX.md` for detailed troubleshooting.
