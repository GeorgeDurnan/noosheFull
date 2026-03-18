import { useEffect, useRef } from "react" 
/**
 * Prevents body scroll when a modal is open.
 * @param {boolean} show - If true, freezes the body scroll.
 */
export const useNoScroll = (show) => {
    useEffect(() => {
        if (show) {
            document.documentElement.style.overflowY = 'hidden' 
            document.documentElement.style.overscrollBehavior = 'none' 
        } else {
            document.documentElement.style.overflowY = '' 
            document.documentElement.style.overscrollBehavior = '' 
        }

        // Cleanup: Ensures scroll is re-enabled if component unmounts
        return () => {
            document.documentElement.style.overflow = '' 
            document.documentElement.style.overscrollBehavior = '' 
        }
    }, [show]) 
}
/**
 * Hook to detect clicks outside of a container and trigger a close action.
 * @param {boolean} show - State indicating if the element is visible.
 * @param {function} setShow - Setter function to update the show state.
 * @param {function} [handleClose] - Optional custom handler for closing the element. Defaults to setShow(false).
 * @returns {React.MutableRefObject} Ref to be attached to the target container.
 */
export const useClickOutside = (show, setShow, handleClose = (()=>{setShow(false)})) => {
    const modalRef = useRef(null) 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose()
            }
        } 

        document.addEventListener('mousedown', handleClickOutside) 

        return () => {
            document.removeEventListener('mousedown', handleClickOutside) 
        } 
    }, [show]) 
    return modalRef
}