# Quick Start: Training ML Models

## Step-by-Step Guide

### 1. Organize Your Dataset

Your images are currently in:
- `data/medicines/` - Medicine package images
- `data/Skin_images/` - Skin condition images

**Option A: Organize into folders (Recommended)**

Create folders for each medicine/condition and move images:

```bash
# For medicines
data/medicines/
├── paracetamol/
│   └── (move paracetamol images here)
├── ibuprofen/
│   └── (move ibuprofen images here)
└── ...

# For skin conditions
data/Skin_images/
├── acne/
│   └── (move acne images here)
├── eczema/
│   └── (move eczema images here)
└── ...
```

**Option B: Use labels.json**

Run the helper script to create label files:
```bash
python organize_data.py
```

Then edit the generated `labels.json` files to map image names to medicine/condition names.

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs PyTorch, torchvision, scikit-learn, and other ML libraries.

### 3. Train Medicine Model

```bash
python train_medicine_model.py
```

Training will:
- Load all images from `data/medicines/`
- Train for 30 epochs
- Save best model to `models/medicine_model_best.pth`
- Show training progress and accuracy

**Expected output:**
```
Using device: cuda (or cpu)
Loading medicine images...
Found X images
Number of classes: Y
Classes: [...]
Training samples: X, Validation samples: Y
Creating model...
Starting training...
[Progress bars and accuracy metrics]
Training completed!
Best validation accuracy: XX.XX%
```

### 4. Train Skin Condition Model

```bash
python train_skin_model.py
```

Same process as medicine model, but for skin conditions.

### 5. Test the Models

Start the backend server:
```bash
python main.py
```

The models will automatically load when the server starts. You should see:
```
✓ Loaded medicine classification model with X classes
✓ Loaded skin condition classification model with X classes
```

### 6. Use Through Frontend

1. Start frontend: `npm run dev`
2. Test Medicine Scanner: Upload a medicine image
3. Test Visual Diagnosis: Upload a skin image

The backend will use your trained models for predictions!

## Tips for Better Accuracy

1. **More Data**: Aim for 50+ images per class
2. **Balanced Classes**: Similar number of images per class
3. **Quality Images**: Clear, well-lit, focused images
4. **Proper Labeling**: Ensure correct folder/label names
5. **More Epochs**: Increase `num_epochs` if accuracy is still improving

## Troubleshooting

**"No images found"**
- Check folder paths are correct
- Verify image formats (.jpg, .jpeg, .png)
- Ensure images are in the right directory

**Low accuracy**
- Add more training images
- Check image quality
- Verify correct labeling
- Train for more epochs

**CUDA errors**
- Reduce batch_size if GPU memory is limited
- Use CPU (slower but works)

## Current Dataset Status

Your current images:
- Medicines: 6 images in `data/medicines/`
- Skin: 4 images in `data/Skin_images/`

**Note**: For good accuracy, you'll need more images. Consider:
- Adding more images per medicine/condition
- Organizing them into folders by name
- Or creating labels.json files

Once organized, run the training scripts!
