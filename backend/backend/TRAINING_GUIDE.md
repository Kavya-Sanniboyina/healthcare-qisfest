# ML Model Training Guide

This guide explains how to train the ML models for medicine identification and skin condition classification.

## Prerequisites

1. **Python 3.8+** installed
2. **PyTorch** installed (will be installed with requirements.txt)
3. **Organized dataset** in `data/` folder

## Dataset Organization

### Option 1: Folder Structure (Recommended)

Organize images into folders by class:

**For Medicines:**
```
data/medicines/
├── paracetamol/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── ibuprofen/
│   ├── image1.jpg
│   └── ...
└── amoxicillin/
    └── ...
```

**For Skin Conditions:**
```
data/Skin_images/
├── acne/
│   ├── image1.jpg
│   └── ...
├── eczema/
│   ├── image1.jpg
│   └── ...
└── psoriasis/
    └── ...
```

### Option 2: Labels File

If all images are in one folder, create a `labels.json` file:

**For Medicines (`data/medicines/labels.json`):**
```json
{
  "image1.jpg": "paracetamol",
  "image2.jpg": "ibuprofen",
  "image3.jpg": "amoxicillin"
}
```

**For Skin (`data/Skin_images/labels.json`):**
```json
{
  "image1.jpg": "acne",
  "image2.jpg": "eczema",
  "image3.jpg": "psoriasis"
}
```

## Quick Start

### Step 1: Organize Your Data

Run the organization helper:
```bash
python organize_data.py
```

This will:
- Check your current data structure
- Create example `labels.json` files if needed
- Guide you on how to organize images

### Step 2: Train Medicine Model

```bash
python train_medicine_model.py
```

This will:
- Load images from `data/medicines/`
- Train a ResNet18-based CNN model
- Save the best model to `models/medicine_model_best.pth`
- Save label mapping to `models/medicine_labels.json`

### Step 3: Train Skin Condition Model

```bash
python train_skin_model.py
```

This will:
- Load images from `data/Skin_images/`
- Train a ResNet18-based CNN model
- Save the best model to `models/skin_model_best.pth`
- Save label mapping to `models/skin_labels.json`

## Training Configuration

### Medicine Model Training

Edit `train_medicine_model.py` to adjust:
- `batch_size`: Number of images per batch (default: 16)
- `num_epochs`: Training epochs (default: 30)
- `learning_rate`: Learning rate (default: 0.001)
- `image_size`: Input image size (default: 224)

### Skin Model Training

Edit `train_skin_model.py` to adjust:
- Same parameters as medicine model
- Additional data augmentation for skin images

## Model Architecture

Both models use **ResNet18** with:
- Pre-trained ImageNet weights (transfer learning)
- Fine-tuned final layer for your specific classes
- Data augmentation (rotation, flipping, color jitter)
- Validation split (20% of data)

## Training Output

During training, you'll see:
- Training loss and accuracy per epoch
- Validation accuracy per epoch
- Best model saved automatically when validation accuracy improves

After training:
- `models/medicine_model_best.pth` - Best model (highest validation accuracy)
- `models/medicine_model_final.pth` - Final model after all epochs
- `models/medicine_labels.json` - Label to class mapping
- `models/skin_model_best.pth` - Best skin model
- `models/skin_model_final.pth` - Final skin model
- `models/skin_labels.json` - Skin label mapping

## Improving Accuracy

### 1. More Data
- Add more images per class (aim for 50+ per class)
- Ensure balanced classes (similar number of images per class)

### 2. Data Quality
- Use clear, well-lit images
- Consistent image sizes and orientations
- Remove blurry or low-quality images

### 3. Data Augmentation
- Already included: rotation, flipping, color jitter
- Can add more in training scripts if needed

### 4. Model Tuning
- Increase training epochs
- Adjust learning rate
- Try different architectures (ResNet50, EfficientNet)

### 5. Transfer Learning
- Models use pre-trained ResNet18 weights
- Fine-tune more layers if you have more data

## Using Trained Models

Once trained, the models are automatically loaded by:
- `ml_models/medicine_scanner.py` - For medicine identification
- `ml_models/visual_diagnosis.py` - For skin condition analysis

The backend API will use these models when processing images.

## Troubleshooting

### Error: "No images found"
- Check that images are in correct directory
- Verify image formats (.jpg, .jpeg, .png)
- Check folder structure matches expected format

### Error: "CUDA out of memory"
- Reduce `batch_size` in training script
- Use CPU instead (slower but works)
- Reduce `image_size`

### Low Accuracy
- Add more training data
- Check data quality
- Ensure proper labeling
- Try more training epochs

### Model Not Loading
- Verify model files exist in `models/` directory
- Check that label files are present
- Ensure PyTorch is installed correctly

## Example Training Session

```bash
$ python train_medicine_model.py
Using device: cuda
Loading medicine images...
Found 120 images
Number of classes: 6
Classes: ['amoxicillin', 'ibuprofen', 'paracetamol', ...]
Training samples: 96, Validation samples: 24
Creating model...
Starting training...
Epoch 1/30 [Train]: loss=1.2345, acc=45.23%
Epoch 1/30 [Val]: acc=52.34%
✓ Saved best model with validation accuracy: 52.34%
...
Epoch 30/30 [Train]: loss=0.1234, acc=95.67%
Epoch 30/30 [Val]: acc=92.45%

==================================================
Training completed!
Best validation accuracy: 94.23%
Model saved to: models/medicine_model_best.pth
Final model saved to: models/medicine_model_final.pth
==================================================
```

## Next Steps

After training:
1. Test models with sample images
2. Deploy backend server
3. Test through frontend interface
4. Monitor accuracy in production
5. Retrain with more data as needed

## Tips

- **Start small**: Train with a few classes first to verify setup
- **Monitor overfitting**: If validation accuracy stops improving, stop training
- **Save checkpoints**: Best model is saved automatically
- **Use GPU**: Training is much faster on GPU (if available)
- **Validate manually**: Check predictions on test images manually
