import { SERVER_BASE_URL } from "../config" 
import { useState } from "react"
import { useEffect } from "react"
import styles from "./contact.module.css"
import modalStyles from "./modals.module.css"
import { useNoScroll, useClickOutside } from "../features/hooks/modalUtilities"

/**
 * ContactForm Component
 * Displays a modal with a contact form used to collect user details.
 * 
 * @param {Object} props
 * @param {boolean} props.showContact - Controls visibility of the contact modal
 * @param {Function} props.setShowContact - Function to toggle the modal's visibility
 */
export const ContactForm = ({ showContact, setShowContact }) => {
    const [time, setTime] = useState(new Date()) 
    const [show, setShow] = useState(true)
    const url = SERVER_BASE_URL
    if(true){

    }
    const modalRef = useClickOutside(showContact, setShowContact)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.target
        const name = form.name.value
        const email = form.email.value

        const response = await fetch(url + "contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name, "email": email }),
            credentials: 'include'
        }) 
        console.log(response)
        if (response.status === 201) {
            setShow(prev => !prev)
        }
    }

    /**
     * Toggles the contact modal visibility.
     */
    const handleClick = () => {
        setShowContact(prev => !prev)
    }

    useEffect(() => {
        // Update time every second for the clock display
        const timer = setInterval(() => {
            setTime(new Date()) 
        }, 1000) 

        // Cleanup interval on component unmount to prevent memory leaks
        return () => clearInterval(timer) 
    }, []) 

    /**
     * Formats a Date object into a readable time string (HH:MM).
     * @param {Date} date - The date object to format
     * @returns {string} Formatted time string
     */
    const formatTime = (date) => {
        const pad = (n) => n.toString().padStart(2, "0") 
        return `${pad(date.getHours())}:${pad(date.getMinutes())}` 
    } 
    return (
        <div className={`${modalStyles.modalContainer} ${styles.modalContainer}`}>
            <div className={`${modalStyles.modal} ${styles.modal}`} ref={modalRef}>
                <div className={styles.header}>
                    <h2>Nooshé</h2>
                    <h2 onClick={handleClick} className={styles.xBtn}>X</h2>
                </div>
                {show ? <div className={styles.messageCon}>
                    <h3>{formatTime(time)}</h3>

                    <div className={styles.topMsgCon}>
                        <h3 className={styles.topMsg}>To send us a message, first leave your contact info so we can get back to you.</h3>
                    </div>
                    <p></p>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputCon}>
                            <label htmlFor="name">Name:</label>
                            <input className={styles.input} type="text" id="name" name="name"></input>
                        </div>
                        <div className={styles.inputCon}>
                            <label htmlFor="email">Email:</label>
                            <input className={styles.input} type="email" id="email" name="email"></input>
                        </div>
                        <input className={styles.submit} type="submit" value="Submit"></input>
                    </form>
                </div>
                    : <p>Thankyou your request has been submitted you will be emailed soon</p>}

            </div>

        </div>
    )
}