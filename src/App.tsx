import { useEffect, useState } from 'react';
import { useColor } from 'react-color-palette';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firestore, firebase } from './firebase/firebase';
import 'firebase/compat/auth';
import './App.css';
import Display from './components/Display/Display';
import AddPixelControls from './components/AddPixelControls/AddPixelControls';
import CurrentPosition from './components/CurrentPosition/CurrentPosition';
import Profile from './components/Profile/Profile';

const CHUNK_SIZE = 64; // Number of pixels stored as one document in Firestore
const SIZE_MODIFIER = 0.25; // Multiplies size of all three.js objects by this

function App() {
    // If user is signed in
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    // State of canvas
    const [canvasData, setCanvasData] = useState<
        Array<{ x: number; y: number; color: string; uid: string }>
    >([]);

    // Width of selectable canvas area
    const SELECTABLE_CANVAS_WIDTH = 500;
    // Height of selectable canvas 
    const SELECTABLE_CANVAS_HEIGHT = 500; 

    // Currently selected pixel; pixel to be edited
    const [selectedPosition, setSelectedPosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });

    // Color of pixel to be edited
    const [color, setColor] = useColor('hex', '#ffffff');

    // Refresh canvasData on page load
    useEffect(() => {
        getChunkData();
    }, []);

    // Connect to Firestore
    const getChunkData = async () => {
        // Query the chunks collection
        const chunkQuery = query(collection(firestore, 'chunks'));

        // Establish realtime connection
        const unsubscribe = await onSnapshot(chunkQuery, (snapshot) => {
            // Clear old canvas Data
            setCanvasData([]);

            // Create array to store new canvasData
            let newCanvasData: typeof canvasData = [];

            // Add new canvas data
            snapshot.forEach((chunk) => {
                // For each chunk

                Object.keys(chunk.data()).forEach((pixel) => {
                    // For each pixel

                    const newPixel = {
                        // x = x_chunk * CHUNK_SIZE + x_local * CHUNK_SIZE
                        // if x_local < 0, add another CHUNK_SIZE
                        // then multiply result by SIZE_MODIFIER
                        x:
                            (parseInt(
                                chunk.id.substring(1, chunk.id.search('y'))
                            ) *
                                CHUNK_SIZE +
                                parseInt(
                                    pixel.substring(1, pixel.search('y'))
                                ) +
                                (parseInt(
                                    chunk.id.substring(1, chunk.id.search('y'))
                                ) < 0
                                    ? CHUNK_SIZE
                                    : 0)) *
                            SIZE_MODIFIER,
                        y:
                            (parseInt(
                                chunk.id.substring(chunk.id.search('y') + 1)
                            ) *
                                CHUNK_SIZE +
                                parseInt(
                                    pixel.substring(pixel.search('y') + 1)
                                ) +
                                (parseInt(
                                    chunk.id.substring(chunk.id.search('y') + 1)
                                ) < 0
                                    ? CHUNK_SIZE
                                    : 0)) *
                            SIZE_MODIFIER,
                        // Decode color and uid from chunk.data()[pixel] which
                        // has format #112233!abcd if color is #112233 and uid
                        // is abcd or #112233 if no uid
                        color: chunk.data()[pixel].includes('!')
                            ? chunk
                                  .data()
                                  [pixel].substring(
                                      0,
                                      chunk.data()[pixel].indexOf('!')
                                  )
                            : chunk.data()[pixel],
                        // If uid exists, set it otherwise set to Anonymous
                        uid: chunk.data()[pixel].includes('!')
                            ? chunk
                                  .data()
                                  [pixel].substring(
                                      chunk.data()[pixel].indexOf('!') + 1,
                                      chunk.data()[pixel].length
                                  )
                            : 'Anonymous',
                    };

                    // Add to newCanvasData
                    newCanvasData.push(newPixel);
                });
            });

            // Update canvasData
            setCanvasData(newCanvasData);
        });
    };

    return (
        <>
            <div className="App">
                <Display
                    canvasData={canvasData}
                    selectedPosition={selectedPosition}
                    setSelectedPosition={setSelectedPosition}
                    color={color}
                    sizeModifier={SIZE_MODIFIER}
                    canvasWidth={SELECTABLE_CANVAS_WIDTH}
                    canvasHeight={SELECTABLE_CANVAS_HEIGHT}
                />

                <Profile
                    isSignedIn={isSignedIn}
                    firebase={firebase}
                    setIsSignedIn={setIsSignedIn}
                />

                <AddPixelControls
                    firestore={firestore}
                    firebase={firebase}
                    CHUNK_SIZE={CHUNK_SIZE}
                    mousePosition={selectedPosition}
                    color={color}
                    setColor={setColor}
                    canvasDataLength={canvasData.length}
                />

                <CurrentPosition mousePosition={selectedPosition} />
            </div>
        </>
    );
}

export default App;
