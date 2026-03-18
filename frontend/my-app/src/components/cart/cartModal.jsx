import { SERVER_BASE_URL } from "../../config"
import { Cart } from "./cart"
import { useNoScroll, useClickOutside } from "../../features/hooks/modalUtilities"
import styles from "./../modals.module.css"
/**
 * CartModal component
 * Displays the shopping cart in a modal window.
 * 
 * @param {Object} props
 * @param {Function} props.setShow - Function to toggle modal visibility
 * @param {boolean} props.show - State of modal visibility
 */
export const CartModal = ({ setShow, show }) => {
    const url = SERVER_BASE_URL

    // Prevent background scrolling when modal is open
    useNoScroll(show)

    // Handle clicks outside the modal to close it
    const modalRef = useClickOutside(show, setShow)

    // Close modal handler
    function handleClick() {
        setShow(false)
    }

    return (
        <div>
            <div className={`${styles.modalContainer} ${styles.modalConCart}`} >
                <div className={`${styles.modal} ${styles.modalCart}`} ref={modalRef}>
                    <div className={`${styles.top}`}>
                        <h2>Cart</h2>
                        <button className={`${styles.btnTopCart}`} onClick={handleClick}>X</button>
                    </div>
                    <Cart setSelf={setShow} className={styles.cartCon} />
                </div>
            </div>
        </div>

    )
}