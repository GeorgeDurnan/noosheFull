import { useSelector } from "react-redux"
import { CartItem } from "./cartItem"
import { useNavigate } from "react-router-dom"
import { getCart } from "../../features/slices/cartSlice"
import { useCreateCartItems } from "../../utilities/carts/createCartItems"
import { useState } from "react"
import style from "./cart.module.css"
export const Cart = (props) => {
    const cart = useSelector(getCart)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const cartItems = useCreateCartItems()

    if (cartItems.arranged == "loading") {
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
        <div className={props.className}>
            <div className={style.cart}>
                <div className={style.cartItems}>
                    {cartItems.arranged.map((item) => {
                        return <CartItem key={JSON.stringify(item)} cart={true} item={item} />
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