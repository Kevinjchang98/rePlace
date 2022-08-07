import { doc, setDoc } from 'firebase/firestore';
import { Color, ColorPicker } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';

interface AddPixelControlsProps {
    firestore: any; // TODO: Update firestore type
    mousePosition: { x: number; y: number };
    color: Color;
    setColor: Function;
}
function AddPixelControls({
    firestore,
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

    // Push data
    const handleSubmit = () => {
        pushCanvasData(mousePosition.x, mousePosition.y, color.hex);
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
        </div>
    );
}

export default AddPixelControls;
