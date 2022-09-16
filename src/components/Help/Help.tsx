import { useState } from 'react';
import styles from './Help.module.css';

function Help() {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    return (
        <>
            <div className={styles.buttonWrapper}>
                <button
                    onClick={() => {
                        setIsHidden(!isHidden);
                    }}
                >
                    ?
                </button>
            </div>

            {isHidden ? null : (
                <div
                    onClick={() => {
                        setIsHidden(true);
                    }}
                    className={styles.popupWrapper}
                >
                    <div className={styles.popupContentWrapper}>
                        <h1>Help</h1>
                        <p>
                            Inspired by{' '}
                            <a href="https://www.reddit.com/r/place/">
                                Reddit's r/place
                            </a>
                            , this is a collaborative canvas where users can
                            place down colored pixels
                        </p>

                        <p>
                            You can left-click drag to move the canvas and
                            right-click drag to rotate the camera in 3D. The
                            color picker for each pixel can be found on the
                            right, and is minimized by default. Left-clicking
                            will choose the next pixel to be colored.
                        </p>

                        <p>
                            There are also keyboard controls. You can use the
                            arrow keys or WASD to move the cursor around and
                            space to color the selected pixel in.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Help;
