"""
Data Organization Script
Helps organize images into folders by class for training
"""

import os
import shutil
from pathlib import Path
import json

def organize_medicines():
    """Organize medicine images into folders by medicine name"""
    data_dir = Path('data/medicines')
    
    # Check if already organized
    subdirs = [d for d in data_dir.iterdir() if d.is_dir()]
    if subdirs:
        print("Medicine data appears to be organized in folders already.")
        print("Folders found:", [d.name for d in subdirs])
        return
    
    # Get all images
    images = list(data_dir.glob('*.jpg')) + list(data_dir.glob('*.jpeg')) + list(data_dir.glob('*.png'))
    
    if len(images) == 0:
        print("No images found in data/medicines/")
        return
    
    print(f"Found {len(images)} medicine images")
    print("\nTo organize these images, you need to:")
    print("1. Create folders for each medicine (e.g., data/medicines/paracetamol/)")
    print("2. Move images to appropriate folders")
    print("\nOR create a labels.json file with this structure:")
    print('{"image1.jpg": "paracetamol", "image2.jpg": "ibuprofen", ...}')
    
    # Create example labels.json
    example_labels = {}
    for img in images:
        example_labels[img.name] = "medicine_name_here"  # User should fill this
    
    labels_file = data_dir / 'labels.json'
    if not labels_file.exists():
        with open(labels_file, 'w') as f:
            json.dump(example_labels, f, indent=2)
        print(f"\nCreated example labels.json at {labels_file}")
        print("Please edit this file to map image names to medicine names")


def organize_skin_images():
    """Organize skin images into folders by condition"""
    data_dir = Path('data/Skin_images')  # Note: folder name is "Skin_images" (capital S)
    
    # Check if already organized
    subdirs = [d for d in data_dir.iterdir() if d.is_dir()]
    if subdirs:
        print("Skin data appears to be organized in folders already.")
        print("Folders found:", [d.name for d in subdirs])
        return
    
    # Get all images
    images = list(data_dir.glob('*.jpg')) + list(data_dir.glob('*.jpeg')) + list(data_dir.glob('*.png'))
    
    if len(images) == 0:
        print("No images found in data/Skin_images/")
        return
    
    print(f"Found {len(images)} skin images")
    print("\nTo organize these images, you need to:")
    print("1. Create folders for each condition (e.g., data/Skin_images/acne/, data/Skin_images/eczema/)")
    print("2. Move images to appropriate folders")
    print("\nOR create a labels.json file with this structure:")
    print('{"image1.jpg": "acne", "image2.jpg": "eczema", ...}')
    
    # Create example labels.json
    example_labels = {}
    for img in images:
        example_labels[img.name] = "condition_name_here"  # User should fill this
    
    labels_file = data_dir / 'labels.json'
    if not labels_file.exists():
        with open(labels_file, 'w') as f:
            json.dump(example_labels, f, indent=2)
        print(f"\nCreated example labels.json at {labels_file}")
        print("Please edit this file to map image names to condition names")


def main():
    print("="*60)
    print("Data Organization Helper")
    print("="*60)
    
    print("\n1. Organizing Medicine Images...")
    organize_medicines()
    
    print("\n2. Organizing Skin Images...")
    organize_skin_images()
    
    print("\n" + "="*60)
    print("Next Steps:")
    print("1. Organize your images into folders OR edit labels.json files")
    print("2. Run: python train_medicine_model.py")
    print("3. Run: python train_skin_model.py")
    print("="*60)


if __name__ == '__main__':
    main()
