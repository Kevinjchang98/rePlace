import { Canvas } from '@react-three/fiber';
import { Color } from 'react-color-palette';
import { PlaneBufferGeometry, DoubleSide, NoToneMapping } from 'three';
import { useMemo, useRef } from 'react';
import { MapControls } from '@react-three/drei';
import useEventListener from '../../hooks/useEventListener';
import styles from './Display.module.css';

interface CanvasProps {
    canvasData: Array<{ x: number; y: number; color: string }>;
    selectedPosition: { x: number; y: number };
    setSelectedPosition: Function;
    color: Color;
    sizeModifier: number;
    canvasWidth: number;
    canvasHeight: number;
}

interface PixelData {
    x: number;
    y: number;
    color: string;
}

function Display({
    canvasData,
    selectedPosition,
    setSelectedPosition,
    color,
    sizeModifier,
    canvasWidth,
    canvasHeight,
}: CanvasProps) {
    const LAYER_OFFSET = 0.001; // Offset to resolve z-fighting
    const INDICATOR_LINE_WIDTH = 0.1; // Thickness of selected pixel indicator outline

    const controlsRef = useRef<any>(); // Ref to MapControls

    const pixelGeometry = useMemo(() => new PlaneBufferGeometry(), []); // Pixel geo

    // Takes in canvasData, which is an array of objects of type PixelData and
    // returns meshes that contain a singular plane of specified color
    const pixels = canvasData.map((pixel: PixelData, i: number) => {
        return (
            <mesh
                position={[pixel.x, pixel.y, 0]}
                key={i}
                geometry={pixelGeometry}
                scale={[sizeModifier, sizeModifier, sizeModifier]}
            >
                <meshStandardMaterial side={DoubleSide} color={pixel.color} />
            </mesh>
        );
    });

    // Plane to allow for selecting of pixel by clicking the mouse
    const mousePositionCapturePlane = (
        <mesh
            scale={[canvasWidth * sizeModifier, canvasHeight * sizeModifier, 1]}
            position={[0, 0, 0]}
            onClick={(e) => {
                let mousePos = {
                    x: Math.round(e.point.x / sizeModifier),
                    y: Math.round(e.point.y / sizeModifier),
                };
                setSelectedPosition(mousePos);
            }}
        >
            <planeBufferGeometry />
            <meshStandardMaterial side={DoubleSide} visible={false} />
        </mesh>
    );

    // Indicator of selected pixel
    // TODO: Invert color if selected pixel is dark
    const selectedPixelIndicator = (
        <>
            {/* Outline */}
            <mesh
                position={[
                    (selectedPosition.x - (0.5 - INDICATOR_LINE_WIDTH / 2)) *
                        sizeModifier,
                    selectedPosition.y * sizeModifier,
                    LAYER_OFFSET,
                ]}
                scale={[INDICATOR_LINE_WIDTH * sizeModifier, sizeModifier, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial side={DoubleSide} color={'black'} />
            </mesh>
            <mesh
                position={[
                    (selectedPosition.x + (0.5 - INDICATOR_LINE_WIDTH / 2)) *
                        sizeModifier,
                    selectedPosition.y * sizeModifier,
                    LAYER_OFFSET,
                ]}
                scale={[INDICATOR_LINE_WIDTH * sizeModifier, sizeModifier, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial side={DoubleSide} color={'black'} />
            </mesh>
            <mesh
                position={[
                    selectedPosition.x * sizeModifier,
                    (selectedPosition.y - (0.5 - INDICATOR_LINE_WIDTH / 2)) *
                        sizeModifier,
                    LAYER_OFFSET,
                ]}
                scale={[sizeModifier, INDICATOR_LINE_WIDTH * sizeModifier, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial side={DoubleSide} color={'black'} />
            </mesh>
            <mesh
                position={[
                    selectedPosition.x * sizeModifier,
                    (selectedPosition.y + (0.5 - INDICATOR_LINE_WIDTH / 2)) *
                        sizeModifier,
                    LAYER_OFFSET,
                ]}
                scale={[sizeModifier, INDICATOR_LINE_WIDTH * sizeModifier, 1]}
            >
                <planeBufferGeometry />
                <meshStandardMaterial side={DoubleSide} color={'black'} />
            </mesh>

            {/* Color indicator */}
            <mesh
                position={[
                    selectedPosition.x * sizeModifier,
                    selectedPosition.y * sizeModifier,
                    LAYER_OFFSET,
                ]}
                scale={[
                    (1 - INDICATOR_LINE_WIDTH * 3) * sizeModifier,
                    (1 - INDICATOR_LINE_WIDTH * 3) * sizeModifier,
                    1,
                ]}
            >
                <circleBufferGeometry args={[0.3, 32]} />
                <meshStandardMaterial side={DoubleSide} color={color.hex} />
            </mesh>
        </>
    );

    // Stores mapping used for new x, y position corresponding to each key
    // key: key type, value: [x, y] where x = change in x pos, and y = change in
    // y pos
    const keyMap = {
        ArrowUp: [0, 1],
        ArrowDown: [0, -1],
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
        w: [0, 1],
        a: [-1, 0],
        s: [0, -1],
        d: [1, 0],
    };

    // TODO: also make wasd controllable. make space and enter submit color
    // Capture keypresses
    useEventListener('keydown', ({ key }: { key: keyof typeof keyMap }) => {
        const dx = keyMap[key][0];
        const dy = keyMap[key][1];
        const mousePos = {
            x: selectedPosition.x + dx,
            y: selectedPosition.y + dy,
        };

        if (
            mousePos.x <= canvasWidth / 2 &&
            mousePos.x >= -canvasWidth / 2 &&
            mousePos.y <= canvasHeight / 2 &&
            mousePos.y >= -canvasHeight / 2
        ) {
            setSelectedPosition(mousePos);
        }
    });

    return (
        <>
            <div className={styles.buttonWrapper}>
                <button
                    onClick={() => {
                        if (controlsRef.current) {
                            controlsRef.current.reset();
                        }
                    }}
                >
                    Reset
                </button>
            </div>

            <div className={styles.canvasWrapper}>
                <Canvas
                    frameloop="demand"
                    orthographic={true}
                    camera={{
                        position: [0, 0, 50],
                        zoom: 10,
                        up: [0, 0, 1],
                        far: 10000,
                    }}
                    gl={{ toneMapping: NoToneMapping }}
                >
                    {/* TODO: Verify if there's a better way to resolve TS errors with these props */}
                    <MapControls
                        addEventListener={undefined}
                        hasEventListener={undefined}
                        removeEventListener={undefined}
                        dispatchEvent={undefined}
                        ref={controlsRef}
                    />

                    <ambientLight />

                    {mousePositionCapturePlane}

                    {selectedPixelIndicator}

                    {pixels}
                </Canvas>
            </div>
        </>
    );
}

export default Display;
