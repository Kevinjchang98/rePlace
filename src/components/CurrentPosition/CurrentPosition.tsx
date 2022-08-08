import { useState } from 'react';

interface CurrentPositionProps {
    mousePosition: { x: number; y: number };
}
function CurrentPosition({
    mousePosition
}: CurrentPositionProps) {

    return (
        <div>
            <h2>({mousePosition.x}, {mousePosition.y})</h2>
        </div>
    );
}

export default CurrentPosition;
