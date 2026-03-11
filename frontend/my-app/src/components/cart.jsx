import { useSelector } from "react-redux"
import { CartItem } from "./cartItem"
import { useNavigate } from "react-router-dom"
import { getCart } from "../features/slices/cartSlice"
import { useCreateCartItems } from "../utilities/carts/createCartItems"
import { getAddressFromSlice } from "../features/slices/addressSlice"
import { useState } from "react"
import { AddressModal } from "./pages/payment/addressModal"
import style from "./cart.module.css"
export const Cart = (props) => {
    const cart = useSelector(getCart)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const cartItems = useCreateCartItems()
    
    if (cartItems == "loading") {
        return (
            <h1 className={`${style.empty}`}>Your cart is empty</h1>
        )
    }
    function handleClick(event) {
        if (props?.setSelf) {
            props?.setSelf(false)
        }
        navigate(`/${event.target.value}`)

    }
    return (
        <div className={style.cartCon}>
            <div className={style.cart}>
                <div className={style.cartItems}>
                    {cartItems.map((item) => {
                        return <CartItem key={JSON.stringify(item)} item={item} />
                    })}
                </div>
                <div className={style.btns}>
                    <button className={`${style.btn} ${style.btnCheck} `} value={"checkout"} onClick={handleClick}>Checkout</button>
                    <button className={`${style.btn} ${style.btnCart} `} value={"cart-page"} onClick={handleClick}>View cart</button>
                </div>
            </div>
        </div>
    )
}