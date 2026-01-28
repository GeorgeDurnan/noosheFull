import { useState } from "react"
import { Cart } from "./cart"
export const Nav = () => {
    const [cart, setCart] = useState(false)
    function handleClick(){
        setCart(prev => !prev)
    }
    return (<div id="nav">
        <a href="/">Home</a>
        <a href="/online-ordering">Online Order</a>
        <a href="/trade-order">Wholesale</a>
        <a href="/about-us">About us</a>
        <a href="/profile">Profile</a>
        <button onClick={handleClick}>Cart</button>
        {cart && <Cart />}
    </div>)
}  