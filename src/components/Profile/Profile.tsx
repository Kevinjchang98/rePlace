import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeIn from 'react-fade-in';

interface ProfileProps {
    firebase: any;
    firestore: any;
}

function Profile({ firebase, firestore }: ProfileProps) {
    const [data, setData] = useState<{ edits: number }>();

    // TODO: Check if logged in first
    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        const profileSnapshot = await getDoc(
            doc(firestore, 'users', firebase.auth().currentUser.uid)
        );

        if (profileSnapshot.exists()) {
            setData(profileSnapshot.data() as keyof typeof data);
        }
    };

    return (
        <>
            {data ? (
                <FadeIn delay={75}>
                    <h1>{firebase.auth().currentUser.displayName}</h1>
                    <p>Edits made: {data.edits}</p>
                    <p>
                        Last logged in:{' '}
                        {firebase.auth().currentUser.metadata.lastSignInTime}
                    </p>
                    <p>
                        Account created:{' '}
                        {firebase.auth().currentUser.metadata.creationTime}
                    </p>
                    <Link to="/">Back</Link>
                </FadeIn>
            ) : (
                <FadeIn delay={100}>
                    <Link to="/">Back</Link>
                </FadeIn>
            )}
        </>
    );
}

export default Profile;
