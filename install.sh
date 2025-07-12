#!/bin/bash
# Unified installation script for the entire project
set -e

echo "Installing Pantry Sync application..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
chmod +x install.sh
chmod +x run.sh
./install.sh
cd ..

# Install frontend dependencies  
echo "Installing frontend dependencies..."
cd frontend
chmod +x install.sh
chmod +x run.sh
./install.sh
cd ..

echo "Installation completed successfully!"
