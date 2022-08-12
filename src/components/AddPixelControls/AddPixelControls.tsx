import { doc, Firestore, setDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Color, ColorPicker } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';

interface AddPixelControlsProps {
    firestore: Firestore;
    CHUNK_SIZE: number;
    mousePosition: { x: number; y: number };
    color: Color;
    setColor: Function;
    canvasDataLength: number;
}
function AddPixelControls({
    firestore,
    CHUNK_SIZE,
    mousePosition,
    color,
    setColor,
    canvasDataLength,
}: AddPixelControlsProps) {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    const pushChunkData = async (x: number, y: number, color: string) => {
        const newData: any = {};

        newData[`x${x % CHUNK_SIZE}y${y % CHUNK_SIZE}`] = color;

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
    };

    return (
        <div>
            <button
                onClick={() => {
                    setIsHidden(!isHidden);
                }}
            >
                {isHidden ? '+' : '-'}
            </button>

            {isHidden ? null : (
                <div>
                    Color:
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
                    <br />
                    <button
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
                    <p>Total pixels drawn: {canvasDataLength}</p>
                </div>
            )}
        </div>
    );
}

export default AddPixelControls;
