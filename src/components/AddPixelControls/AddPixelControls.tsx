import { doc, setDoc, updateDoc } from 'firebase/firestore';
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

    const pushChunkData = async (x: number, y: number, color: string) => {
        // console.log({
        //     chunkX: Math.floor(x / 64),
        //     chunkY: Math.floor(y / 64),
        //     x: x % 64,
        //     y: y % 64,
        //     color: color,
        // });

        const newData: any = {};

        console.log(`local: x${x % 64}y${y % 64}`);
        console.log(
            'global: x' + Math.floor(x / 64) + 'y' + Math.floor(y / 64)
        );
        newData[`x${x % 64}y${y % 64}`] = color;

        // console.log(newData);

        // Try to update existing chunk doc, if it doesn't exist then create it
        try {
            await updateDoc(
                doc(
                    firestore,
                    'chunks',
                    String('x' + Math.floor(x / 64) + 'y' + Math.floor(y / 64))
                ),
                newData
            );
        } catch (error) {
            await setDoc(
                doc(
                    firestore,
                    'chunks',
                    String('x' + Math.floor(x / 64) + 'y' + Math.floor(y / 64))
                ),
                newData
            );
        }
    };

    // Push data
    const handleSubmit = () => {
        pushChunkData(mousePosition.x, mousePosition.y, color.hex);
        // pushCanvasData(mousePosition.x, mousePosition.y, color.hex);
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
