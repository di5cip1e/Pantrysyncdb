# Firebase Deployment Guide for Pantry Sync

This guide will help you deploy your Pantry Sync application to Firebase Hosting.

## Prerequisites

1. **Firebase CLI installed** ✅ (already installed)
2. **Firebase project created** - You need to create a Firebase project in the Firebase Console
3. **Authentication with Firebase** - You need to be logged into Firebase CLI

## Step-by-Step Deployment

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable Firebase Hosting in the project

### 2. Configure Your Project
1. Update `.firebaserc` file with your project ID:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```

2. Update `firebase.json` if needed:
   - The current configuration assumes your frontend builds to `frontend/dist`
   - API routes are configured to proxy to your backend

### 3. Login to Firebase
```bash
firebase login
```

### 4. Build Your Application
```bash
# Use the provided build script
./build.sh

# Or manually:
cd frontend
yarn install
yarn build
cd ..
```

### 5. Deploy to Firebase
```bash
firebase deploy
```

## Current Configuration

### Firebase Hosting (`firebase.json`)
- **Public directory**: `frontend/dist`
- **Rewrites**: 
  - API routes (`/routes/**`) proxy to your backend
  - All other routes serve `index.html` (SPA routing)
- **Headers**: Optimized caching for JS/CSS files

### Project Structure
```
/workspaces/Pantrysyncdb/
├── frontend/               # React frontend
│   ├── dist/              # Build output (after running build)
│   ├── src/               # Source code
│   ├── package.json
│   └── vite.config.ts
├── backend/               # Python FastAPI backend
├── firebase.json          # Firebase configuration
├── .firebaserc           # Firebase project settings
├── build.sh              # Build script
└── README-firebase.md    # This file
```

## Troubleshooting

### "Invalid root directory" Error
This error occurs when:
1. `firebase.json` is missing or misconfigured
2. The public directory doesn't exist
3. Firebase CLI can't find the project configuration

**Solution**: Make sure you have:
- `firebase.json` in the root directory
- `.firebaserc` with correct project ID
- Built frontend in `frontend/dist`

### Build Issues
If you encounter build issues:
1. Make sure you're using the correct Node.js version
2. Enable corepack: `corepack enable`
3. Use yarn instead of npm for this project

### Backend Integration
For production deployment, you'll need to:
1. Deploy your Python backend separately (e.g., Google Cloud Run, Railway, etc.)
2. Update the rewrite rules in `firebase.json` to point to your production backend URL

## Environment Variables
Make sure to set up environment variables for production:
- Update your frontend `.env` file
- Configure API endpoints for production
- Set up Firebase authentication if used

## Commands Reference

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if needed)
firebase init

# Build the application
./build.sh

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View deployed site
firebase open hosting:site
```

## Next Steps

1. **Create your Firebase project** in the Firebase Console
2. **Update `.firebaserc`** with your actual project ID
3. **Login to Firebase CLI**: `firebase login`
4. **Build your app**: `./build.sh`
5. **Deploy**: `firebase deploy`

The "invalid root directory" error should be resolved once you have the proper configuration files in place and your frontend is built.
