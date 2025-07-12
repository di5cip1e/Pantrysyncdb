#!/bin/bash

# Build script for Firebase deployment
echo "Building Pantry Sync application..."

# Navigate to frontend directory
cd frontend

# Install dependencies using yarn (since this is a yarn project)
echo "Installing frontend dependencies..."
yarn install

# Build the frontend
echo "Building frontend..."
yarn build

# Navigate back to root
cd ..

echo "Build completed! The built files are in frontend/dist"
echo "You can now deploy to Firebase using: firebase deploy"
