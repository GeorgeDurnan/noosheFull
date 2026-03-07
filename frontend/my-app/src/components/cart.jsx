import { useSelector, useDispatch } from "react-redux"
import { CartItem } from "./cartItem"
import { useNavigate } from "react-router-dom"
import { getCart } from "../features/slices/cartSlice"
import { useCreateCartItems } from "../utilities/carts/createCartItems"
import { getAddressFromSlice } from "../features/slices/addressSlice"
import { useState } from "react"
import { AddressModal } from "./pages/payment/addressModal"
export const Cart = (props) => {

    const cart = useSelector(getCart)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const cartItems = useCreateCartItems()
    const basic = useSelector(getAddressFromSlice)
    if (cartItems == "loading") {
        return (
            <h1>Your cart is empty</h1>
        )
    }
    function handleClick(event) {
        if (props?.setSelf) {
            props?.setSelf(false)
        }
        navigate(`/${event.target.value}`)

    }
    return (
        <div>
            {basic && <h3>Shipping to {basic.label}</h3>}
            {cartItems.map((item) => {
                return <CartItem key={JSON.stringify(item)} item={item} />
            })}
            <button value={"cart-page"} onClick={handleClick}>View cart</button>
            <button value={"checkout"} onClick={handleClick}>Checkout</button>
            <button onClick={() => setShow(true)}>Change address</button>
            {show && <AddressModal setShow={setShow} show={show} />}
        </div>
    )
}