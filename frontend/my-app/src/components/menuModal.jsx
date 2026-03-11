import { SERVER_BASE_URL } from "../config"
import { useNoScroll, useClickOutside } from "../features/hooks/modalUtilities"
import styles from "./modals.module.css"
import { Menu } from "./menu"
export const MenuModal = ({ setShow, show }) => {
    const url = SERVER_BASE_URL
    useNoScroll(show)
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