import { StrictMode, useEffect, useState } from 'react';
import { useColor } from 'react-color-palette';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firestore } from './firestore/firestore';
import './App.css';
import Display from './components/Display/Display';
import AddPixelControls from './components/AddPixelControls/AddPixelControls';

const CHUNK_SIZE = 64;

function App() {
    const [canvasData, setCanvasData] = useState<
        Array<{ x: number; y: number; color: string }>
    >([]); // State of canvas
    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });
    const [color, setColor] = useColor('hex', '#ffffff'); // Color of pixel to be edited
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    // Refresh canvasData on page load
    useEffect(() => {
        // getCanvasData();
        getChunkData();
    }, []);

    // Removes duplicate pixels from canvasData
    const removeDuplicates = async () => {
        setCanvasData(
            canvasData.filter(
                (A, index) =>
                    index ===
                    canvasData.findIndex((B) => B.x === A.x && B.y === A.y)
            )
        );
        console.log('Canvas data length' + canvasData.length);
    };

    const getChunkData = async () => {
        const chunkQuery = query(collection(firestore, 'chunks'));

        const unsubscribe = await onSnapshot(chunkQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                // console.log(
                //     change.doc.data()[
                //         Object.keys(change.doc.data())[
                //             Object.keys(change.doc.data()).length - 1
                //         ]
                //     ]
                // );

                // console.log(
                //     Object.keys(change.doc.data())[
                //         Object.keys(change.doc.data()).length - 1
                //     ]
                // );

                Object.keys(change.doc.data()).forEach((item) => {
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

                    // global x coord but +64 if negative x chunk coord
                    // parseInt(
                    //     doc.id.substring(1, doc.id.search('y'))
                    // ) *
                    //     64 +
                    // parseInt(item.substring(1, item.search('y'))) +
                    // (parseInt(
                    //     doc.id.substring(1, doc.id.search('y'))
                    // ) < 0
                    //     ? 64
                    //     : 0)

                    // global y coord but +64 if negative y chunk coord
                    // parseInt(
                    //     doc.id.substring(doc.id.search('y') + 1)
                    // ) *
                    //     64 +
                    // parseInt(item.substring(item.search('y') + 1)) +
                    // (parseInt(
                    //     doc.id.substring(doc.id.search('y') + 1)
                    // ) < 0
                    //     ? 64
                    //     : 0)

                    // doc.data()[item] = #00ff00
                    // console.log(doc.data()[item]);

                    setCanvasData((prevState: typeof canvasData) => {
                        const newPixel = {
                            x:
                                parseInt(
                                    change.doc.id.substring(
                                        1,
                                        change.doc.id.search('y')
                                    )
                                ) *
                                    CHUNK_SIZE +
                                parseInt(item.substring(1, item.search('y'))) +
                                (parseInt(
                                    change.doc.id.substring(
                                        1,
                                        change.doc.id.search('y')
                                    )
                                ) < 0
                                    ? CHUNK_SIZE
                                    : 0),
                            y:
                                parseInt(
                                    change.doc.id.substring(
                                        change.doc.id.search('y') + 1
                                    )
                                ) *
                                    CHUNK_SIZE +
                                parseInt(item.substring(item.search('y') + 1)) +
                                (parseInt(
                                    change.doc.id.substring(
                                        change.doc.id.search('y') + 1
                                    )
                                ) < 0
                                    ? CHUNK_SIZE
                                    : 0),
                            color: change.doc.data()[item],
                        };

                        // for (let i = 0; i < prevState.length; i++) {
                        //     if (
                        //         prevState[i].x == newPixel.x &&
                        //         prevState[i].y == newPixel.y
                        //     ) {
                        //         console.log(newPixel.x);
                        //     }
                        // }

                        // console.log(...filteredState);
                        // console.log(canvasData.length);

                        return [...prevState, newPixel];
                    });
                });
            });
        });
    };

    return (
        <StrictMode>
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
                    CHUNK_SIZE={CHUNK_SIZE}
                    mousePosition={mousePosition}
                    color={color}
                    setColor={setColor}
                    cull={removeDuplicates}
                />
            </div>
        </StrictMode>
    );
}

export default App;
