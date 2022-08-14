import styles from './CurrentPosition.module.css';

interface CurrentPositionProps {
    mousePosition: { x: number; y: number };
}
function CurrentPosition({ mousePosition }: CurrentPositionProps) {
    return (
        <div className={styles.wrapper}>
            ({mousePosition.x}, {mousePosition.y})
        </div>
    );
}

export default CurrentPosition;
