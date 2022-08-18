import {
    doc,
    Firestore,
    increment,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import { Color, ColorPicker } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
import styles from './AddPixelControls.module.css';

interface AddPixelControlsProps {
    firestore: Firestore;
    firebase: any;
    CHUNK_SIZE: number;
    mousePosition: { x: number; y: number };
    color: Color;
    setColor: Function;
}
function AddPixelControls({
    firestore,
    firebase,
    CHUNK_SIZE,
    mousePosition,
    color,
    setColor,
}: AddPixelControlsProps) {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    const pushChunkData = async (x: number, y: number, color: string) => {
        const newData: any = {};
        const uid = firebase?.auth()?.currentUser?.uid;

        // Append uid with ! delimiter if it exists, otherwise only include hex
        newData[`x${x % CHUNK_SIZE}y${y % CHUNK_SIZE}`] =
            color + (uid ? `!${uid}` : '');

        // Format chunk id string (e.g. x12y24)
        const newChunkId = String(
            'x' + Math.floor(x / CHUNK_SIZE) + 'y' + Math.floor(y / CHUNK_SIZE)
        );

        // Try to update existing chunk doc, if it doesn't exist then create it
        try {
            await updateDoc(doc(firestore, 'chunks', newChunkId), newData);
        } catch (error) {
            await setDoc(doc(firestore, 'chunks', newChunkId), newData);
        }

        // Try to update user doc and increment number of pixels edited
        try {
            await updateDoc(doc(firestore, 'users', uid ? uid : 'Anonymous'), {
                edits: increment(1),
            });
        } catch (error) {
            await setDoc(doc(firestore, 'users', uid ? uid : 'Anonymous'), {
                edits: increment(1),
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={`${styles.minimizeButton} ${styles.pointerEventsWrapper}`}
                onClick={() => {
                    setIsHidden(!isHidden);
                }}
            >
                {isHidden ? '+' : '-'}
            </button>

            {isHidden ? null : (
                <div className={styles.contents}>
                    <div className={styles.pointerEventsWrapper}>
                        <ColorPicker
                            width={250}
                            height={200}
                            color={color}
                            onChange={(newColor) => {
                                setColor(newColor);
                            }}
                            hideHSV
                            dark
                        />
                    </div>
                    <button
                        className={styles.pointerEventsWrapper}
                        onClick={() => {
                            pushChunkData(
                                mousePosition.x,
                                mousePosition.y,
                                color.hex
                            );
                        }}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddPixelControls;
