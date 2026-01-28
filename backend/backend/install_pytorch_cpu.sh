#!/bin/bash
echo "Installing PyTorch CPU-only version (more stable)"
echo ""
echo "Uninstalling existing PyTorch..."
pip uninstall torch torchvision -y
echo ""
echo "Installing PyTorch CPU version..."
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
echo ""
echo "Installation complete!"
echo ""
echo "Test with: python -c 'import torch; print(\"PyTorch works!\")'"
