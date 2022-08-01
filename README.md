# rePlace

## Running

Use `npm install` to install all dependencies, then `npm run dev` to start local development server

## Environment variables for Firebase config

Currently it uses Vercel environment variables when deployed and a `.env.local` file locally to set the environment variables. The `.env.local` file has the following format:

```
VITE_VERCEL_FIREBASE_API_KEY = key
VITE_VERCEL_FIREBASE_AUTH_DOMAIN = authdomain
VITE_VERCEL_FIREBASE_PROJECT_ID = projectid
VITE_VERCEL_FIREBASE_STORAGE_BUCKET = storagebucket
VITE_VERCEL_FIREBASE_MESSAGING_SENDER_ID = messagingsenderid
VITE_VERCEL_FIREBASE_APP_ID = appid
VITE_VERCEL_FIREBASE_MEASUREMENT_ID = measurementid
```
