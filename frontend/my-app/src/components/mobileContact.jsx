import { ContactSvg } from "../images/svgs/contactSvg"
import styles from "./contact.module.css"
import modalStyle from "./modals.module.css"
import { useNoScroll, useClickOutside } from "../features/hooks/modalUtilities"

/**
 * Mobile contact modal component that displays contact options.
 * 
 * @param {Object} props
 * @param {Function} props.setShow - Function to update the visibility state of this modal.
 * @param {boolean} props.show - Boolean indicating if the modal is currently visible. Used for scroll locking and click-outside detection.
 * @param {Function} props.setShowContact - Function to open the main contact form modal.
 */
export const MobileContact = ({ setShow, show, setShowContact }) => {
    function handleClose() {
        setShow(false)
    }

    // Closes current modal and opens message form
    function openMessage() {
        setShowContact(true)
        setShow(false)
    }

    // Lock body scroll when modal is open
    useNoScroll(show)
    // Close modal when clicking outside content
    const modalRef = useClickOutside(show, setShow)
    return (
        <div className={`${modalStyle.modalContainer} ${styles.modalContainer}`}>
            <div className={styles.openContactMob} ref={modalRef}>
                <div className={styles.labelled}>
                    <label htmlFor="message">Message us</label>
                    <button id="message" onClick={openMessage}><ContactSvg name="msg" /></button>
                </div>
                <div className={styles.labelled}>
                    <label htmlFor="insta">Instagram</label>
                    <a href="https://www.instagram.com/nooshe.bakery/" id="insta" ><ContactSvg name="insta" /></a>
                </div>
                <div className={styles.labelled}>
                    <label htmlFor="email">Email us</label>
                    <a href="mailto:info@nooshe.co.uk" id="email"><ContactSvg name="email" /></a>
                </div>
                <div className={styles.labelled}>
                    <button onClick={handleClose} className={styles.close} id="message">X</button>
                </div>
            </div>
        </div>
    )
}