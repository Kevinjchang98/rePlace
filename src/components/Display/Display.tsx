import { Canvas } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import { useEffect } from 'react';

interface CanvasProps {
    getCanvasData: Function;
    canvasData: Array<{ x: number; y: number; color: string }>;
    setMousePosition: Function;
}

interface PixelData {
    x: number;
    y: number;
    color: string;
}

function Display({ getCanvasData, canvasData, setMousePosition }: CanvasProps) {
    // Refresh canvas data on page load
    useEffect(() => {
        getCanvasData();
    }, []);

    // Takes in canvasData, which is an array of objects of type PixelData and
    // returns meshes that contain a singular plane of specified color
    const pixels = canvasData.map((pixel: PixelData, i: number) => {
        return (
            <mesh position={[pixel.x, pixel.y, 0]} key={i}>
                <planeBufferGeometry />
                <meshStandardMaterial color={'#' + pixel.color} />
            </mesh>
        );
    });

    // What gets rendered on the main page
    return (
        // TODO: Refactor style into css module
        <div>
            {/* Container for three canvas */}
            <div
                style={{
                    width: '100vw',
                    height: '70vh',
                    backgroundColor: 'white',
                }}
            >
                <Canvas
                    orthographic={true}
                    camera={{
                        position: [0, 0, 50],
                        zoom: 10,
                        up: [0, 0, 1],
                        far: 10000,
                    }}
                >
                    {/* TODO: Verify if there's a better way to resolve TS errors with these props */}
                    <MapControls
                        addEventListener={undefined}
                        hasEventListener={undefined}
                        removeEventListener={undefined}
                        dispatchEvent={undefined}
                    />

                    <pointLight position={[100, 100, 100]} />

                    <mesh
                        scale={[1000, 1000, 1]}
                        position={[0, 0, -0.001]} // -0.001 to fix z-fighting
                        onClick={(e) => {
                            let mousePos = {
                                x: Math.round(e.point.x),
                                y: Math.round(e.point.y),
                            };
                            setMousePosition(mousePos);
                        }}
                    >
                        <planeBufferGeometry />
                    </mesh>

                    {pixels}
                </Canvas>
            </div>

            {/* Button to manually refresh canvas data */}
            <button onClick={() => getCanvasData()}>Get Firebase data</button>
        </div>
    );
}

export default Display;
