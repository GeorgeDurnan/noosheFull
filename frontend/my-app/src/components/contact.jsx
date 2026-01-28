import { ContactForm } from "./contactForm"
import { useState } from "react"
export const Contact = () => {
    const [showContact, setShowContact] = useState(false)
    const Button = <button onClick = {handleClick}>Contact us</button>
    function handleClick() {
        setShowContact(prev => !prev)
    }
    return (<div id = "contact">
        {!showContact && Button}
        {showContact && <ContactForm setShowContact={setShowContact} showContact = {showContact} />}
    </div>
    )
}