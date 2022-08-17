import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div>
            <h1>{firebase.auth().currentUser.displayName}</h1>
            {data ? <p>Edits made: {data.edits}</p> : null}
            <Link to="/">Back</Link>
        </div>
    );
}

export default Profile;
