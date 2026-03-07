import { WholesaleForm } from "./wholesaleForm"
import { useState } from "react"
export const Wholesale = () => {
    const [show, setShow] = useState(true)
    const [msg, setMsg] = useState("")
    return (
        <>
            <h1>Bulk Orders</h1>
            <p>At Nooshé, we take pride in supplying our handcrafted baked goods to a diverse clientele. Whether you're a café, restaurant, corporate entity, or planning a special event, our offerings are tailored to meet your needs.</p>
            <h2>For Businesses:</h2>
            <p>We collaborate with numerous cafés, restaurants, and retailers, providing them with our unique selection of pastries, cakes, and cookies. Our trade partners benefit from competitive pricing, consistent quality, and reliable delivery schedules.</p>
            <h2>For Events:</h2>
            <p>Hosting a wedding, birthday, corporate event, or any special gathering? Nooshé offers bulk ordering options to make your occasion memorable. Enjoy exclusive pricing and customisable selections to suit your event's theme and guest preferences.</p>
            <h2>Please provide</h2>
            {(show && <WholesaleForm setShow ={setShow} setMsg={setMsg}/>) || <h1>{msg}</h1>}
        </>
    )
}