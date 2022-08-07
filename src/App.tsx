import { useEffect, useState } from 'react';
import { useColor } from 'react-color-palette';
import { collection, onSnapshot, query } from 'firebase/firestore';
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
    const [color, setColor] = useColor('hex', '#ffffff'); // Color of pixel to be edited

    // Canvas collection from firestore
    const canvasCollection = collection(firestore, 'pixels');

    // Refresh canvasData on page load
    useEffect(() => {
        // getCanvasData();
        getChunkData();
    }, []);

    const getChunkData = async () => {
        const chunkQuery = query(collection(firestore, 'chunks'));

        const unsubscribe = await onSnapshot(chunkQuery, (snapshot) => {
            snapshot.forEach((doc) => {
                // console.log(doc.data());
                Object.keys(doc.data()).forEach((item) => {
                    // doc.id = x1y1 = chunk coordinates encoded string
                    // console.log(doc.id);

                    // chunk x coord
                    // console.log(doc.id.substring(1, doc.id.search('y')));

                    // chunk y coord
                    // console.log(doc.id.substring(doc.id.search('y') + 1));

                    // item = x42y42 = local coordinates encoded string
                    // console.log(item);

                    // local x coord
                    // console.log(item.substring(1, item.search('y')));

                    // local y coord
                    // console.log(item.substring(item.search('y') + 1));

                    // global x coord
                    // console.log(
                    //     parseInt(doc.id.substring(1, doc.id.search('y'))) * 64 +
                    //         parseInt(item.substring(1, item.search('y')))
                    // );

                    // global y coord
                    // console.log(
                    //     parseInt(doc.id.substring(doc.id.search('y') + 1)) *
                    //         64 +
                    //         parseInt(item.substring(item.search('y') + 1))
                    // );

                    // doc.data()[item] = #00ff00
                    // console.log(doc.data()[item]);

                    setCanvasData((prevState: typeof canvasData) => [
                        ...prevState,
                        {
                            x:
                                parseInt(
                                    doc.id.substring(1, doc.id.search('y'))
                                ) *
                                    64 +
                                parseInt(item.substring(1, item.search('y'))),
                            y:
                                parseInt(
                                    doc.id.substring(doc.id.search('y') + 1)
                                ) *
                                    64 +
                                parseInt(item.substring(item.search('y') + 1)),
                            color: doc.data()[item],
                        },
                    ]);
                });
            });
        });
    };

    // Getter for canvas data
    const getCanvasData = async () => {
        const canvasQuery = query(canvasCollection);

        // Get realtime updates
        const unsubscribe = await onSnapshot(canvasQuery, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setCanvasData((prevState: typeof canvasData) => [
                    ...prevState,
                    {
                        x: doc.data().x,
                        y: doc.data().y,
                        color: doc.data().color,
                    },
                ]);
            });
        });
    };

    return (
        <>
            <div className="App">
                <Display
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
                    mousePosition={mousePosition}
                    color={color}
                    setColor={setColor}
                />
            </div>
        </>
    );
}

export default App;
