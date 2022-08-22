import { useEffect, useState } from 'react';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { Link } from 'react-router-dom';
import styles from './LoginStatus.module.css';

interface ProfileProps {
    firebase: any;
    isSignedIn: boolean;
    setIsSignedIn: Function;
    filterUserPixels: boolean;
    setFilterUserPixels: Function;
}

function LoginStatus({
    firebase,
    isSignedIn,
    setIsSignedIn,
    filterUserPixels,
    setFilterUserPixels,
}: ProfileProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
        <div className={styles.wrapper}>
            <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
            />
        </div>
    ) : !isExpanded ? (
        <div className={styles.wrapper}>
            <a onClick={() => setIsExpanded(!isExpanded)}>{`Expand - `}</a>
            <Link to="/profile">
                {`${firebase.auth().currentUser.displayName} - `}
            </Link>
            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
    ) : (
        <div className={styles.wrapper}>
            <a onClick={() => setIsExpanded(!isExpanded)}>{`Minimize - `}</a>
            <Link to="/profile">
                {`${firebase.auth().currentUser.displayName} - `}
            </Link>
            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
            <button onClick={() => setFilterUserPixels(!filterUserPixels)}>
                Toggle user pixels
            </button>
        </div>
    );
}

export default LoginStatus;
