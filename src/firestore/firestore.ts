import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import data from '../../firebase_config.json';

if (data.isServer) {
    console.log(import.meta.env.VITE_VERCEL_URL);
    console.log('Server');
    console.log(import.meta.env.VITE_VERCEL_FIREBASE_API_KEY);
    initializeApp({
        apiKey: import.meta.env.VITE_VERCEL_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_VERCEL_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_VERCEL_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_VERCEL_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env
            .VITE_VERCEL_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_VERCEL_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_VERCEL_FIREBASE_MEASUREMENT_ID,
    });
} else {
    initializeApp({
        apiKey: data.apiKey,
        authDomain: data.authDomain,
        projectId: data.projectId,
        storageBucket: data.storageBucket,
        messagingSenderId: data.messagingSenderId,
        appId: data.appId,
        measurementId: data.measurementId,
    });
}

const firestore = getFirestore();

export { firestore };
