import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { Color, ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

interface AddPixelControlsProps {
    firestore: any; // TODO: Update firestore type
    getCanvasData: Function;
}

function AddPixelControls({ firestore, getCanvasData }: AddPixelControlsProps) {
    const [x, setX] = useState<number>(0); // X coordinate to be edited
    const [y, setY] = useState<number>(0); // Y coordinate to be edited
    const [color, setColor] = useColor("hex", "#121212"); // Color of pixel to be edited

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
        pushCanvasData(x, y, color.hex);
        getCanvasData();
    };

    return (
        <>
            {/* Temporary way to push data to database */}
            <form>
                <label>
                    X coordinate:
                    <input
                        type="number"
                        value={x}
                        onChange={(e) => {
                            setX(parseInt(e.target.value));
                        }}
                    />
                </label>
                <br />

                <label>
                    Y coordinate:
                    <input
                        type="number"
                        value={y}
                        onChange={(e) => {
                            setY(parseInt(e.target.value));
                        }}
                    />
                </label>
                <br />

                <label>
                    Color in hex:
                    {/* <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                            setColor(e.target.value);
                        }}
                    /> */}
                    <ColorPicker width={456} height={228} color={color} onChange={setColor} hideHSV dark />
                </label>
            </form>

            <br />
            <button onClick={handleSubmit}>Push Firebase data</button>
        </>
    );
}

export default AddPixelControls;
