import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

await import('../../firebase_config.json')
    .then((data) => {
        if (!data.isServer) {
            initializeApp({
                apiKey: data.apiKey,
                authDomain: data.authDomain,
                projectId: data.projectId,
                storageBucket: data.storageBucket,
                messagingSenderId: data.messagingSenderId,
                appId: data.appId,
                measurementId: data.measurementId,
            });
        } else {
            initializeApp({
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId:
                    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            });
        }
    })
    .catch((e) => {
        console.log(e);
    });

const firestore = getFirestore();

export { firestore };
