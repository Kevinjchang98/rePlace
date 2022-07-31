import { useState } from 'react';
import {
    collection,
    DocumentData,
    getDocs,
    query,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firestore } from './firestore/firestore';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);

    const [canvasData, setCanvasData] = useState<Array<Object>>([]);

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

    return (
        <div className="App">
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            Sample canvas data fetched from firestore:
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
                <button onClick={() => getCanvasData()}>
                    Get Firebase data
                </button>
                <p>Sample canvas data: </p>
                {canvasData.map((pixel: any, i) => {
                    return (
                        <p key={i}>
                            [{pixel.x}, {pixel.y}] has color {pixel.color}
                        </p>
                    );
                })}
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}

export default App;
