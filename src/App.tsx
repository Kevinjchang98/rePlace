import { useState } from 'react';
import {
    collection,
    DocumentData,
    getDocs,
    query,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firestore } from './firestore/firestore';
import './App.css';
import Canvas from './components/Canvas/Canvas';
import AddPixelControls from './components/AddPixelControls/AddPixelControls';

function App() {
    const [canvasData, setCanvasData] = useState<Array<Object>>([]); // State of canvas

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
    };

    return (
        <div className="App">
            <div className="card">
                <Canvas getCanvasData={getCanvasData} canvasData={canvasData} />

                <AddPixelControls
                    firestore={firestore}
                    getCanvasData={getCanvasData}
                />
            </div>
        </div>
    );
}

export default App;
