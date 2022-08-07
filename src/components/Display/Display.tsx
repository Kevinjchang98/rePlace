import { Canvas } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import { useEffect } from 'react';

interface CanvasProps {
    getCanvasData: Function;
    canvasData: Array<{ x: number; y: number; color: string }>;
    mousePosition: { x: number; y: number };
    setMousePosition: Function;
}

interface PixelData {
    x: number;
    y: number;
    color: string;
}

function Display({
    getCanvasData,
    canvasData,
    mousePosition,
    setMousePosition,
}: CanvasProps) {
    const LAYER_OFFSET = 0.001; // Offset to resolve z-fighting
    const SELECTABLE_CANVAS_WIDTH = 1000; // Width of selectable canvas area
    const SELECTABLE_CANVAS_HEIGHT = 1000; // Height of selectable canvas
    const INDICATOR_LINE_WIDTH = 0.05; // Thickness of selected pixel indicator outline

    // Refresh canvasData on page load
    useEffect(() => {
        getCanvasData();
    }, []);

    // Takes in canvasData, which is an array of objects of type PixelData and
    // returns meshes that contain a singular plane of specified color
    const pixels = canvasData.map((pixel: PixelData, i: number) => {
        return (
            <mesh position={[pixel.x, pixel.y, 0]} key={i}>
                <planeBufferGeometry />
                <meshStandardMaterial color={pixel.color} />
            </mesh>
        );
    });

    // Plane to allow for selecting of pixel by clicking the mouse
    const mousePositionCapturePlane = (
        <mesh
            scale={[SELECTABLE_CANVAS_WIDTH, SELECTABLE_CANVAS_HEIGHT, 1]}
            position={[0, 0, 0]}
            onClick={(e) => {
                let mousePos = {
                    x: Math.round(e.point.x),
                    y: Math.round(e.point.y),
                };
                setMousePosition(mousePos);
            }}
        >
            <planeBufferGeometry />
            <meshStandardMaterial visible={false} />
        </mesh>
    );

    // Indicator of selected pixel
    // TODO: Invert color if selected pixel is dark
    const selectedPixelIndicator = (
        <>
            <mesh
                position={[
                    mousePosition.x - (0.5 - INDICATOR_LINE_WIDTH / 2),
                    mousePosition.y,
                    LAYER_OFFSET,
                ]}
                scale={[INDICATOR_LINE_WIDTH, 1, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial color={'black'} />
            </mesh>
            <mesh
                position={[
                    mousePosition.x + (0.5 - INDICATOR_LINE_WIDTH / 2),
                    mousePosition.y,
                    LAYER_OFFSET,
                ]}
                scale={[INDICATOR_LINE_WIDTH, 1, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial color={'black'} />
            </mesh>
            <mesh
                position={[
                    mousePosition.x,
                    mousePosition.y - (0.5 - INDICATOR_LINE_WIDTH / 2),
                    LAYER_OFFSET,
                ]}
                scale={[1, INDICATOR_LINE_WIDTH, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial color={'black'} />
            </mesh>
            <mesh
                position={[
                    mousePosition.x,
                    mousePosition.y + (0.5 - INDICATOR_LINE_WIDTH / 2),
                    LAYER_OFFSET,
                ]}
                scale={[1, INDICATOR_LINE_WIDTH, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial color={'black'} />
            </mesh>
        </>
    );

    // What gets rendered on the main page
    return (
        // TODO: Refactor style into css module
        <div>
            {/* Container for three canvas */}
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
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

                    {mousePositionCapturePlane}

                    {selectedPixelIndicator}

                    {pixels}
                </Canvas>
            </div>
        </div>
    );
}

export default Display;
