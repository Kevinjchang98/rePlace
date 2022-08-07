import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { Color, ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';

interface AddPixelControlsProps {
    firestore: any; // TODO: Update firestore type
    getCanvasData: Function;
    mousePosition: { x: number; y: number };
    color: Color;
    setColor: Function;
}
function AddPixelControls({
    firestore,
    getCanvasData,
    mousePosition,
    color,
    setColor,
}: AddPixelControlsProps) {
    // Setter for canvas data
    const pushCanvasData = async (x: number, y: number, color: string) => {
        await setDoc(doc(firestore, 'pixels', String('x' + x + 'y' + y)), {
            x,
            y,
            color,
        });
    };

    // Push data and also get updated data when form submits
    const handleSubmit = () => {
        pushCanvasData(mousePosition.x, mousePosition.y, color.hex);
        getCanvasData();
    };

    return (
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
            <button onClick={handleSubmit}>Submit</button>
            <br />
            <br />
            <button onClick={() => getCanvasData()}>Refresh</button>
        </div>
    );
}

export default AddPixelControls;
