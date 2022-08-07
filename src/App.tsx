import { useEffect, useState } from 'react';
import { useColor } from 'react-color-palette';
import {
    collection,
    DocumentData,
    getDocs,
    query,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firestore } from './firestore/firestore';
import './App.css';
import Display from './components/Display/Display';
import AddPixelControls from './components/AddPixelControls/AddPixelControls';

function App() {
    const [canvasData, setCanvasData] = useState<
        Array<{ x: number; y: number; color: string }>
    >([]); // State of canvas
    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });
    const [color, setColor] = useColor('hex', '#121212'); // Color of pixel to be edited

    // Canvas collection from firestore
    const canvasCollection = collection(firestore, 'pixels');

    // Refresh canvasData on page load
    useEffect(() => {
        getCanvasData();
    }, []);

    // Getter for canvas data
    const getCanvasData = async () => {
        console.log('Getting new canvas data');

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
    };

    return (
        <>
            <div className="App">
                <Display
                    getCanvasData={getCanvasData}
                    canvasData={canvasData}
                    mousePosition={mousePosition}
                    setMousePosition={setMousePosition}
                    color={color}
                />
            </div>

            <div
                style={{
                    position: 'absolute',
                    background: '#888',
                    padding: '10px',
                    right: '0',
                    top: 'calc(50vh - 250px )',
                }}
            >
                <AddPixelControls
                    firestore={firestore}
                    getCanvasData={getCanvasData}
                    canvasData={canvasData}
                    setCanvasData={setCanvasData}
                    mousePosition={mousePosition}
                    color={color}
                    setColor={setColor}
                />
            </div>
        </>
    );
}

export default App;
