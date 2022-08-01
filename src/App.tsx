import { useState } from 'react';
import {
    collection,
    DocumentData,
    getDocs,
    query,
    QueryDocumentSnapshot,
    doc,
    setDoc,
} from 'firebase/firestore';
import { firestore } from './firestore/firestore';
import './App.css';

function App() {
    const [canvasData, setCanvasData] = useState<Array<Object>>([]); // State of canvas
    const [x, setX] = useState<number>(0); // X coordinate to be edited
    const [y, setY] = useState<number>(0); // Y coordinate to be edited
    const [color, setColor] = useState<string>('000000'); // Color of pixel to be edited

    // Canvas collection from firestore
    const canvasCollection = collection(firestore, 'pixels');

    // Getter for canvas data
    const getCanvasData = async () => {
        const canvasQuery = query(canvasCollection);
        const querySnapshot = await getDocs(canvasQuery);

        const result: QueryDocumentSnapshot<DocumentData>[] = [];

        querySnapshot.forEach((snapshot) => {
            result.push(snapshot);
        });

        setCanvasData(
            result.map((pixel) => ({
                x: pixel.data().x,
                y: pixel.data().y,
                color: pixel.data().color,
            }))
        );

        console.log(
            result.map((pixel) => ({
                index: pixel.id,
                color: pixel.data().color,
            }))
        );
    };

    // Setter for canvas data
    const pushCanvasData = async (x: number, y: number, color: string) => {
        await setDoc(doc(firestore, 'pixels', String('x' + x + 'y' + y)), {
            x,
            y,
            color,
        });
    };

    return (
        <div className="App">
            Sample canvas data fetched from firestore:
            <div className="card">
                <button onClick={() => getCanvasData()}>
                    Get Firebase data
                </button>
                <p>Sample canvas data: </p>

                {/* Temporary display of canvas data */}
                {canvasData.map((pixel: any, i) => {
                    return (
                        <p key={i}>
                            [{pixel.x}, {pixel.y}] has color {pixel.color}
                        </p>
                    );
                })}

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

                    <label>
                        Color in hex:
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value);
                            }}
                        />
                    </label>

                    <br />
                </form>

                <button onClick={() => pushCanvasData(x, y, color)}>
                    Push Firebase data
                </button>
            </div>
        </div>
    );
}

export default App;
