"""
Skin Condition Classification Model Training Script
Trains a CNN model to identify skin conditions from images
"""

import os
import sys
import numpy as np
from PIL import Image

# Try to import PyTorch with error handling
try:
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from torch.utils.data import Dataset, DataLoader
    import torchvision.transforms as transforms
    from torchvision.models import resnet18, ResNet18_Weights
    TORCH_AVAILABLE = True
    # Test if torch actually works
    _ = torch.device('cpu')
except (ImportError, OSError, RuntimeError) as e:
    TORCH_AVAILABLE = False
    print("="*60)
    print("ERROR: PyTorch is not available or failed to load!")
    print("="*60)
    print(f"Error: {type(e).__name__}: {str(e)}")
    print("\nSOLUTIONS:")
    print("1. Install Visual C++ Redistributables:")
    print("   Download: https://aka.ms/vs/17/release/vc_redist.x64.exe")
    print("\n2. Reinstall PyTorch CPU version:")
    print("   pip uninstall torch torchvision -y")
    print("   pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu")
    print("\n3. Or use the batch file:")
    print("   .\\install_pytorch_cpu.bat")
    print("\n4. After fixing, run this script again.")
    print("="*60)
    sys.exit(1)

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import json
from pathlib import Path
from tqdm import tqdm

# Set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Using device: {device}')


class SkinDataset(Dataset):
    """Dataset class for skin condition images"""
    
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform
    
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        label = self.labels[idx]
        
        # Load image
        try:
            image = Image.open(image_path).convert('RGB')
        except Exception as e:
            print(f"Error loading {image_path}: {e}")
            # Return a blank image if loading fails
            image = Image.new('RGB', (224, 224), color='white')
        
        # Apply transforms
        if self.transform:
            image = self.transform(image)
        
        return image, label


def load_skin_data(data_dir):
    """
    Load skin condition images from directory structure
    Expected structure:
    data/Skin_images/
        acne/
            image1.jpg
        eczema/
            image1.jpg
    OR
    data/Skin_images/
        image1.jpg (with labels.json mapping)
    """
    data_dir = Path(data_dir)
    image_paths = []
    labels = []
    
    # Check if organized by folders (each folder = one condition)
    subdirs = [d for d in data_dir.iterdir() if d.is_dir()]
    
    if subdirs:
        # Organized by folders
        print("Loading data from folder structure...")
        for subdir in subdirs:
            condition_name = subdir.name
            image_files = list(subdir.glob('*.jpg')) + list(subdir.glob('*.jpeg')) + list(subdir.glob('*.png'))
            
            for img_path in image_files:
                image_paths.append(str(img_path))
                labels.append(condition_name)
    else:
        # All images in one folder - need labels.json
        labels_file = data_dir / 'labels.json'
        if labels_file.exists():
            print("Loading data from labels.json...")
            with open(labels_file, 'r') as f:
                label_mapping = json.load(f)
            
            image_files = list(data_dir.glob('*.jpg')) + list(data_dir.glob('*.jpeg')) + list(data_dir.glob('*.png'))
            for img_path in image_files:
                img_name = img_path.name
                if img_name in label_mapping:
                    image_paths.append(str(img_path))
                    labels.append(label_mapping[img_name])
        else:
            # Auto-label or use single class
            print("No labels found. Using filename-based labeling...")
            image_files = list(data_dir.glob('*.jpg')) + list(data_dir.glob('*.jpeg')) + list(data_dir.glob('*.png'))
            for img_path in image_files:
                image_paths.append(str(img_path))
                # Try to extract condition name from filename
                name = img_path.stem.lower()
                # Default label
                labels.append('skin_condition')
    
    return image_paths, labels


def create_model(num_classes):
    """Create ResNet18-based model for skin condition classification"""
    # Load pre-trained ResNet18
    model = resnet18(weights=ResNet18_Weights.IMAGENET1K_V1)
    
    # Replace the final fully connected layer
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, num_classes)
    
    return model


def train_model(model, train_loader, val_loader, num_epochs=20, learning_rate=0.001):
    """Train the model"""
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=7, gamma=0.1)
    
    best_val_acc = 0.0
    train_losses = []
    val_accuracies = []
    
    for epoch in range(num_epochs):
        # Training phase
        model.train()
        running_loss = 0.0
        train_correct = 0
        train_total = 0
        
        train_pbar = tqdm(train_loader, desc=f'Epoch {epoch+1}/{num_epochs} [Train]')
        for images, labels in train_pbar:
            images = images.to(device)
            labels = labels.to(device)
            
            # Forward pass
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            # Backward pass
            loss.backward()
            optimizer.step()
            
            # Statistics
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            train_total += labels.size(0)
            train_correct += (predicted == labels).sum().item()
            
            train_pbar.set_postfix({
                'loss': f'{loss.item():.4f}',
                'acc': f'{100*train_correct/train_total:.2f}%'
            })
        
        train_loss = running_loss / len(train_loader)
        train_acc = 100 * train_correct / train_total
        train_losses.append(train_loss)
        
        # Validation phase
        model.eval()
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            val_pbar = tqdm(val_loader, desc=f'Epoch {epoch+1}/{num_epochs} [Val]')
            for images, labels in val_pbar:
                images = images.to(device)
                labels = labels.to(device)
                
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
                
                val_pbar.set_postfix({
                    'acc': f'{100*val_correct/val_total:.2f}%'
                })
        
        val_acc = 100 * val_correct / val_total
        val_accuracies.append(val_acc)
        
        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_acc': val_acc,
            }, 'models/skin_model_best.pth')
            print(f'✓ Saved best model with validation accuracy: {val_acc:.2f}%')
        
        scheduler.step()
        print(f'Epoch {epoch+1}: Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%, Val Acc: {val_acc:.2f}%')
    
    return train_losses, val_accuracies


def main():
    # Configuration
    data_dir = 'data/Skin_images'  # Note: folder name is "Skin_images" (capital S)
    batch_size = 16
    num_epochs = 30
    learning_rate = 0.001
    image_size = 224
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Load data
    print("Loading skin condition images...")
    image_paths, labels = load_skin_data(data_dir)
    
    if len(image_paths) == 0:
        print("ERROR: No images found in data directory!")
        print("Please organize images in one of these ways:")
        print("1. Folder structure: data/Skin_images/condition_name/image.jpg")
        print("2. With labels.json: data/Skin_images/labels.json mapping image names to condition names")
        return
    
    print(f"Found {len(image_paths)} images")
    
    # Encode labels
    label_encoder = LabelEncoder()
    encoded_labels = label_encoder.fit_transform(labels)
    num_classes = len(label_encoder.classes_)
    
    print(f"Number of classes: {num_classes}")
    print(f"Classes: {label_encoder.classes_}")
    
    # Save label encoder
    label_mapping = {i: label for i, label in enumerate(label_encoder.classes_)}
    with open('models/skin_labels.json', 'w') as f:
        json.dump(label_mapping, f, indent=2)
    print("Saved label mapping to models/skin_labels.json")
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(
        image_paths, encoded_labels, test_size=0.2, random_state=42, stratify=encoded_labels
    )
    
    print(f"Training samples: {len(X_train)}, Validation samples: {len(X_val)}")
    
    # Data transforms with augmentation
    train_transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3),
        transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Create datasets
    train_dataset = SkinDataset(X_train, y_train, transform=train_transform)
    val_dataset = SkinDataset(X_val, y_val, transform=val_transform)
    
    # Create data loaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=2)
    
    # Create model
    print("Creating model...")
    model = create_model(num_classes)
    model = model.to(device)
    
    # Train model
    print("Starting training...")
    train_losses, val_accuracies = train_model(model, train_loader, val_loader, num_epochs, learning_rate)
    
    # Save final model
    torch.save({
        'model_state_dict': model.state_dict(),
        'num_classes': num_classes,
        'label_mapping': label_mapping,
    }, 'models/skin_model_final.pth')
    
    print("\n" + "="*50)
    print("Training completed!")
    print(f"Best validation accuracy: {max(val_accuracies):.2f}%")
    print(f"Model saved to: models/skin_model_best.pth")
    print(f"Final model saved to: models/skin_model_final.pth")
    print("="*50)


if __name__ == '__main__':
    main()
