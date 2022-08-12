import { useEffect, useRef } from 'react';

const useEventListener = (
    eventName: string,
    handler: Function,
    element = window
) => {
    const savedHandler = useRef<any>();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const eventListener = (event: Event) => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};

export default useEventListener;
