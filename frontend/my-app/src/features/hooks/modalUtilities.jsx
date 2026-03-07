import { useEffect, useRef } from "react";
export const useNoScroll = (show) => {
    useEffect(() => {
        if (show) {
            // When an item is selected, freeze the body scroll
            document.body.style.overflow = 'hidden';
        } else {
            // When no item is selected, enable scroll
            document.body.style.overflow = 'unset';
        }

        // Cleanup: Ensures scroll is re-enabled if component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [show]);
}
//Logic to make the cake close if i click outside fo the container
export const useClickOutside = (show, setShow, handleClose = (()=>{setShow(false)})) => {
    const modalRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the ref exists and the clicked element is NOT inside the ref
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose()
            }
        };

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show]);
    return modalRef
}