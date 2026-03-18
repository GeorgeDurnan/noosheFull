import { SERVER_BASE_URL } from "../config"
import { useNoScroll, useClickOutside } from "../features/hooks/modalUtilities"
import styles from "./modals.module.css"
import { Menu } from "./menu"

/**
 * Renders a modal containing the Menu component.
 * 
 * @param {Object} props
 * @param {Function} props.setShow - Function to set the visibility state of the modal.
 * @param {boolean} props.show - Current visibility state of the modal.
 */
export const MenuModal = ({ setShow, show }) => {
    const url = SERVER_BASE_URL
    // Prevent background scrolling when modal is open
    useNoScroll(show)
    // Handle clicks outside the modal to close it
    const modalRef = useClickOutside(show, setShow)
    
    function handleClick() {
        setShow(false)
    }

    return (
        <div>
            <div className={`${styles.modalContainer} ${styles.modalConMenu}`} >
                <div className={`${styles.modal} ${styles.modalMenu}`} ref={modalRef}>
                    <button className={`${styles.btnTopMenu}`} onClick={handleClick}>X</button>
                    <Menu setSelf={setShow}/>
                </div>
            </div>
        </div>

    )
}