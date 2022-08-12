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
        Array<{ x: number; y: number; color: string }>
    >([]);

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

                    // setCanvasData((prevState: typeof canvasData) => {
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
                        color: chunk.data()[pixel],
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
                />
            </div>

            <div
                style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                }}
            >
                <Profile
                    isSignedIn={isSignedIn}
                    firebase={firebase}
                    setIsSignedIn={setIsSignedIn}
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
                    mousePosition={selectedPosition}
                    color={color}
                    setColor={setColor}
                    canvasDataLength={canvasData.length}
                />
            </div>

            <div
                style={{
                    width: '150px',
                    position: 'absolute',
                    background: '#888',
                    top: '5%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '10%',
                    opacity: '0.6',
                }}
            >
                <CurrentPosition mousePosition={selectedPosition} />
            </div>
        </>
    );
}

export default App;
