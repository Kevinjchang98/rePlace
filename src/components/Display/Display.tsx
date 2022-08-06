import { Canvas } from '@react-three/fiber';

interface CanvasProps {
    getCanvasData: Function;
    canvasData: Array<Object>;
}

function Display({ getCanvasData, canvasData }: CanvasProps) {
    // Temporary function that just takes the canvasData, which is an array of
    // objects, and returns a <p> element for each one that lists its info. Uses
    // the .map function in js
    const listOfTempData = canvasData.map((pixel: any, i) => {
        return (
            <p key={i}>
                [{pixel.x}, {pixel.y}] has color {pixel.color}
            </p>
        );
    });

    // What gets rendered on the main page
    return (
        <div>
            <button onClick={() => getCanvasData()}>Get Firebase data</button>
            <p>Sample canvas data: </p>

            {/* Temporary display of canvas data */}
            {listOfTempData}
        </div>
    );
}

export default Display;
