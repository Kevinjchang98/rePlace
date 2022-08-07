import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { Color, ColorPicker } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';

interface AddPixelControlsProps {
    firestore: any; // TODO: Update firestore type
    CHUNK_SIZE: number;
    mousePosition: { x: number; y: number };
    color: Color;
    setColor: Function;
}
function AddPixelControls({
    firestore,
    CHUNK_SIZE,
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

        console.log(`local: x${x % CHUNK_SIZE}y${y % CHUNK_SIZE}`);
        console.log(
            'global: x' +
                Math.floor(x / CHUNK_SIZE) +
                'y' +
                Math.floor(y / CHUNK_SIZE)
        );
        newData[`x${x % CHUNK_SIZE}y${y % CHUNK_SIZE}`] = color;

        // console.log(newData);

        // Try to update existing chunk doc, if it doesn't exist then create it
        try {
            await updateDoc(
                doc(
                    firestore,
                    'chunks',
                    String(
                        'x' +
                            Math.floor(x / CHUNK_SIZE) +
                            'y' +
                            Math.floor(y / CHUNK_SIZE)
                    )
                ),
                newData
            );
        } catch (error) {
            await setDoc(
                doc(
                    firestore,
                    'chunks',
                    String(
                        'x' +
                            Math.floor(x / CHUNK_SIZE) +
                            'y' +
                            Math.floor(y / CHUNK_SIZE)
                    )
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
