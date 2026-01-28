import { SERVER_BASE_URL } from "../config";
import { useState } from "react"
import { useEffect } from "react"
export const ContactForm = ({showContact, setShowContact}) => {
    const [time, setTime] = useState(new Date());
    const [show, setShow] = useState(true)
    const url = "http://localhost:5000"
    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.target
        const name = form.name.value
        const email = form.email.value

        const response = await fetch(url + "/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "name": name, "email": email }),
        });
         if (response.status === 201) {
            setShow(prev => !prev)
        }
    }
    const handleClick = () =>{
        setShowContact(prev => !prev)
    }

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

    // Format time as HH:MM:SS
    const formatTime = (date) => {
        const pad = (n) => n.toString().padStart(2, "0");
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };
    return (<>
        <h2>Nooshé</h2>
        <button onClick={handleClick}>x</button>
        {show ? <div>
            <h3>{formatTime(time)}</h3>

            <div>
                <h3>To send us a message, first leave your contact info so we can get back to you.</h3>
            </div>
            <p></p>
            <form onSubmit={handleSubmit}>
                <input type="text" id="name" name="name"></input>
                <input type="email" id="email" name="email"></input>
                <input type="submit"></input>
            </form>
        </div>
            : <p>Thankyou your request has been submitted you will be emailed soon</p>}
    </>
    )
}