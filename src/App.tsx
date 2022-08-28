import { useEffect, useState } from 'react';
import { useColor } from 'react-color-palette';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firestore, firebase } from './firebase/firebase';
import 'firebase/compat/auth';
import './App.css';
import Display from './components/Display/Display';
import AddPixelControls from './components/AddPixelControls/AddPixelControls';
import CurrentPosition from './components/CurrentPosition/CurrentPosition';
import LoginStatus from './components/LoginStatus/LoginStatus';
import Profile from './components/Profile/Profile';
import { Route, Routes } from 'react-router-dom';

const CHUNK_SIZE = 64; // Number of pixels stored as one document in Firestore
const SIZE_MODIFIER = 0.25; // Multiplies size of all three.js objects by this
const SELECTABLE_CANVAS_WIDTH = 500; // Width of selectable canvas area
const SELECTABLE_CANVAS_HEIGHT = 500; // Height of selectable canvas

interface PixelData {
    color?: string;
    uid?: string;
    freq?: number;
}

function App() {
    // If user is signed in
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    // If canvas should highlight user's pixels
    const [filterUserPixels, setFilterUserPixels] = useState<boolean>(false);
    // If canvas should show frequency chart
    const [filterFreqPixels, setFilterFreqPixels] = useState<boolean>(false);

    // State of canvas; init empty 2D array of null objects
    const [canvasData, setCanvasData] = useState<
        Array<Array<PixelData | null>>
    >(
        new Array(SELECTABLE_CANVAS_WIDTH)
            .fill(null)
            .map(() => new Array(SELECTABLE_CANVAS_HEIGHT).fill(null))
    );

    // Currently selected pixel; pixel to be edited
    const [selectedPosition, setSelectedPosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });

    // Color of pixel to be edited
    const [color, setColor] = useColor('hex', '#ffffff');

    // Refresh canvasData on page load
    useEffect(() => {
        // Query the chunks collection
        const chunkQuery = query(collection(firestore, 'chunks'));
        const freqQuery = query(collection(firestore, 'freq'));

        // Establish realtime connection for canvasData
        const unsubscribeCanvas = onSnapshot(chunkQuery, (snapshot) => {
            // Create array to store new canvasData
            let newCanvasData: typeof canvasData = [...canvasData];

            // Add new canvas data
            snapshot.forEach((chunk) => {
                // For each chunk

                Object.keys(chunk.data()).forEach((pixel) => {
                    // For each pixel

                    const newPixel = {
                        // x = x_chunk * CHUNK_SIZE + x_local
                        // if x_local < 0, add another CHUNK_SIZE
                        x:
                            parseInt(
                                chunk.id.substring(1, chunk.id.search('y'))
                            ) *
                                CHUNK_SIZE +
                            parseInt(pixel.substring(1, pixel.search('y'))) +
                            (parseInt(
                                chunk.id.substring(1, chunk.id.search('y'))
                            ) < 0
                                ? CHUNK_SIZE
                                : 0) +
                            SELECTABLE_CANVAS_WIDTH / 2,
                        y:
                            parseInt(
                                chunk.id.substring(chunk.id.search('y') + 1)
                            ) *
                                CHUNK_SIZE +
                            parseInt(pixel.substring(pixel.search('y') + 1)) +
                            (parseInt(
                                chunk.id.substring(chunk.id.search('y') + 1)
                            ) < 0
                                ? CHUNK_SIZE
                                : 0) +
                            SELECTABLE_CANVAS_HEIGHT / 2,
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
                    newCanvasData[newPixel.x][newPixel.y] = {
                        color: newPixel.color,
                        uid: newPixel.uid,
                        ...newCanvasData[newPixel.x][newPixel.y],
                    };
                });
            });

            // Update canvasData
            setCanvasData(newCanvasData);
        });

        const unsubscribeFreq = onSnapshot(freqQuery, (snapshot) => {
            // Create array to store new freqData
            let newCanvasData: typeof canvasData = [...canvasData];

            // Add new freq data
            snapshot.forEach((chunk) => {
                // For each chunk

                Object.keys(chunk.data()).forEach((pixel) => {
                    // For each pixel

                    const newPixel = {
                        // x = x_chunk * CHUNK_SIZE + x_local
                        // if x_local < 0, add another CHUNK_SIZE
                        x:
                            parseInt(
                                chunk.id.substring(1, chunk.id.search('y'))
                            ) *
                                CHUNK_SIZE +
                            parseInt(pixel.substring(1, pixel.search('y'))) +
                            (parseInt(
                                chunk.id.substring(1, chunk.id.search('y'))
                            ) < 0
                                ? CHUNK_SIZE
                                : 0) +
                            SELECTABLE_CANVAS_WIDTH / 2,
                        y:
                            parseInt(
                                chunk.id.substring(chunk.id.search('y') + 1)
                            ) *
                                CHUNK_SIZE +
                            parseInt(pixel.substring(pixel.search('y') + 1)) +
                            (parseInt(
                                chunk.id.substring(chunk.id.search('y') + 1)
                            ) < 0
                                ? CHUNK_SIZE
                                : 0) +
                            SELECTABLE_CANVAS_HEIGHT / 2,
                        freq: chunk.data()[pixel],
                    };

                    // Add to newFreqData
                    newCanvasData[newPixel.x][newPixel.y] = {
                        ...newCanvasData[newPixel.x][newPixel.y],
                        freq: newPixel.freq,
                    };
                });
            });

            // Update freqData
            setCanvasData(newCanvasData);
        });

        return () => {
            // Close connections
            unsubscribeCanvas();
            unsubscribeFreq();
        };
    }, []);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className="App">
                        <Display
                            canvasData={canvasData}
                            selectedPosition={selectedPosition}
                            setSelectedPosition={setSelectedPosition}
                            color={color}
                            sizeModifier={SIZE_MODIFIER}
                            canvasWidth={SELECTABLE_CANVAS_WIDTH}
                            canvasHeight={SELECTABLE_CANVAS_HEIGHT}
                            filterUserPixels={filterUserPixels}
                            filterFreqPixels={filterFreqPixels}
                            uid={firebase?.auth()?.currentUser?.uid}
                        />

                        <LoginStatus
                            isSignedIn={isSignedIn}
                            firebase={firebase}
                            setIsSignedIn={setIsSignedIn}
                            filterUserPixels={filterUserPixels}
                            setFilterUserPixels={setFilterUserPixels}
                            filterFreqPixels={filterFreqPixels}
                            setFilterFreqPixels={setFilterFreqPixels}
                        />

                        <AddPixelControls
                            firestore={firestore}
                            firebase={firebase}
                            CHUNK_SIZE={CHUNK_SIZE}
                            mousePosition={selectedPosition}
                            color={color}
                            setColor={setColor}
                        />

                        <CurrentPosition mousePosition={selectedPosition} />
                    </div>
                }
            />

            <Route
                path="/profile"
                element={<Profile firebase={firebase} firestore={firestore} />}
            />
        </Routes>
    );
}

export default App;
