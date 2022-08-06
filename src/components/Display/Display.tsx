import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, MapControls } from '@react-three/drei';
import { useEffect } from 'react';

interface CanvasProps {
    getCanvasData: Function;
    canvasData: Array<{ x: number; y: number; color: string }>;
}

interface PixelData {
    x: number;
    y: number;
    color: string;
}

function Display({ getCanvasData, canvasData }: CanvasProps) {
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
            {/* Button to manually refresh canvas data */}
            <button onClick={() => getCanvasData()}>Get Firebase data</button>

            {/* Container for three canvas */}
            <div
                style={{
                    width: '800px',
                    height: '600px',
                    border: '2px solid red',
                    backgroundColor: 'white',
                }}
            >
                <Canvas orthographic={true}>
                    {/* TODO: Fix TS errors */}
                    <OrthographicCamera
                        makeDefault
                        zoom={20}
                        top={200}
                        bottom={-200}
                        left={200}
                        right={-200}
                        near={1}
                        far={2000}
                        position={[0, 0, 200]}
                    />
                    {/* TODO: MapControls only lets us move horizontally and zoom in/out right now. Need to figure out vertical movement */}
                    <MapControls />
                    <pointLight position={[10, 10, 10]} />

                    {pixels}
                </Canvas>
            </div>
        </div>
    );
}

export default Display;
