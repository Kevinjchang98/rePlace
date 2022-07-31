# Collab-Canvas

## Running

Use `npm install` to install all dependencies, then `npm run dev` to start local development server

## Environment variables for Firebase config

Currently it uses Vercel environment variables when deployed and checks for a `firebase_config.json` file for local development use. Run `git update-index --skip-worktree firebase_config.json` in the root directory to ensure local changes aren't pushed to GitHub before adding in Firebase config information
