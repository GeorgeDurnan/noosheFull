import { ContactForm } from "./contactForm"
import { useState } from "react"
import { MobileContact } from "./mobileContact"
import styles from "./contact.module.css"
export const Contact = () => {
    const [showContact, setShowContact] = useState(false)
    const [show, setShow] = useState(false)
    function handleClick() {
        setShowContact(prev => !prev)
    }
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