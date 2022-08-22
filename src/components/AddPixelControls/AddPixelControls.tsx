import {
    doc,
    Firestore,
    increment,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Color, ColorPicker } from 'react-color-palette';
import { useTimer } from 'react-timer-hook';
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

const TIMER_DELAY = 3; // Minimum seconds between pixels placed

function AddPixelControls({
    firestore,
    firebase,
    CHUNK_SIZE,
    mousePosition,
    color,
    setColor,
}: AddPixelControlsProps) {
    const [isHidden, setIsHidden] = useState<boolean>(true); // If minized or not

    // Init timer
    useEffect(() => {
        time.setSeconds(time.getSeconds());
        restart(time);
    }, []);

    // Pushes color and uid data per pixel
    const pushChunkData = async (x: number, y: number, color: string) => {
        const newData: any = {};
        const uid = firebase?.auth()?.currentUser?.uid;

        time.setSeconds(time.getSeconds() + TIMER_DELAY);
        restart(time);

        // Append uid with ! delimiter if it exists, otherwise only include hex
        newData[`x${x % CHUNK_SIZE}y${y % CHUNK_SIZE}`] =
            color + (uid ? `!${uid}` : '');

        // Format chunk id string (e.g. x12y24)
        const chunkId = String(
            'x' + Math.floor(x / CHUNK_SIZE) + 'y' + Math.floor(y / CHUNK_SIZE)
        );

        // Try to update existing chunk doc, if it doesn't exist then create it
        try {
            await updateDoc(doc(firestore, 'chunks', chunkId), newData);
        } catch (error) {
            await setDoc(doc(firestore, 'chunks', chunkId), newData);
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

    // Pushes edit frequency data per pixel
    const pushFreqData = async (x: number, y: number) => {
        const newData: any = {};

        // Set new data to be old data incremented by 1
        newData[`x${x % CHUNK_SIZE}y${y % CHUNK_SIZE}`] = increment(1);

        // Format chunk id string (e.g. x12y24)
        const chunkId = String(
            'x' + Math.floor(x / CHUNK_SIZE) + 'y' + Math.floor(y / CHUNK_SIZE)
        );

        // Try to update existing chunk doc, if it doesn't exist then create it
        try {
            await updateDoc(doc(firestore, 'freq', chunkId), newData);
        } catch (error) {
            await setDoc(doc(firestore, 'freq', chunkId), newData);
        }
    };

    // Time used for timer
    const time = new Date();

    // TODO: Invalid expiryTimestamp settings warning on mount
    // Exposes seconds counter, restart() method, and isRunning
    const { seconds, restart, isRunning } = useTimer({
        expiry: time,
    } as any);

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
                            if (!isRunning) {
                                pushChunkData(
                                    mousePosition.x,
                                    mousePosition.y,
                                    color.hex
                                );
                                pushFreqData(mousePosition.x, mousePosition.y);
                            }
                        }}
                    >
                        {!isRunning ? `Submit` : seconds}
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddPixelControls;
