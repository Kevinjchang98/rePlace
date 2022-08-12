import { useEffect } from 'react';
import { StyledFirebaseAuth } from 'react-firebaseui';

interface ProfileProps {
    firebase: any;
    isSignedIn: boolean;
    setIsSignedIn: Function;
}

function Profile({ firebase, isSignedIn, setIsSignedIn }: ProfileProps) {
    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false,
        },
    };

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged((user: any) => {
                setIsSignedIn(!!user);
            });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    return !isSignedIn ? (
        <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
        />
    ) : (
        <div style={{ color: '#888', padding: '5px' }}>
            {`${firebase.auth().currentUser.displayName} - `}
            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
    );
}

export default Profile;
