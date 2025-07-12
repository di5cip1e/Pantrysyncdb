#!/usr/bin/env python3
"""
Main entry point for Pantry Sync application
This file provides a unified entry point for deployment platforms
"""
import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Set the working directory to backend
os.chdir(backend_path)

# Import and run the FastAPI app
from main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
