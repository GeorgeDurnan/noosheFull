import { SERVER_BASE_URL } from "../../config"
import { Cart } from "./cart"
import { useNoScroll, useClickOutside } from "../../features/hooks/modalUtilities"
import styles from "./../modals.module.css"
import styles2 from "./cart.module.css"
export const CartModal = ({ setShow, show }) => {
    const url = SERVER_BASE_URL
    useNoScroll(show)
    const modalRef = useClickOutside(show, setShow)
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