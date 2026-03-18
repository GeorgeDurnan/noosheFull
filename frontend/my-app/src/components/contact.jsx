import { ContactForm } from "./contactForm"
import { useState } from "react"
import { MobileContact } from "./mobileContact"
import styles from "./contact.module.css"

/**
 * Contact component that manages the display of contact options.
 * Handles visibility states for both desktop contact form and mobile contact menu.
 */
export const Contact = () => {
    // State to toggle the main contact form visibility
    const [showContact, setShowContact] = useState(false)
    // State to toggle the mobile contact menu visibility
    const [show, setShow] = useState(false)

    /**
     * Toggles the main contact form visibility.
     */
    function handleClick() {
        setShowContact(prev => !prev)
    }

    /**
     * Toggles the mobile contact menu visibility.
     */
    function handleClick2() {
        setShow(prev => !prev)
    }
    return (
        <div className={styles.contactCon}>
            <div className={styles.contact}>
                {!showContact && <button className={styles.btn} onClick={handleClick}>Contact us</button>}
            </div>
            <div className={styles.contactMob}>
                {!showContact && <button className={styles.btn} onClick={handleClick2}>...</button>}
                {show && <MobileContact setShow={setShow} show={show} setShowContact={setShowContact} />}
            </div>
            {showContact && <ContactForm setShowContact={setShowContact} showContact={showContact} />}
        </div>
    )
}