import { useState } from "react"
import { Cart } from "./cart"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
export const Nav = () => {
    const navigate = useNavigate()
    const [cart, setCart] = useState(false)
    function handleClick() {
        setCart(prev => !prev)
    }
    return (<div id="nav">
        <Link to="/">Home</Link>

        <Link to="/online-ordering">Online Order</Link>
        <Link to="/trade-order">Wholesale</Link>
        <Link to="/about-us">About us</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleClick}>Cart</button>
        {cart && <Cart />}
    </div>)
}  