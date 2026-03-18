import { CartItem } from "./cartItem"
import { useNavigate } from "react-router-dom"
import { useCreateCartItems } from "../../utilities/carts/createCartItems"
import style from "./cart.module.css"

/**
 * Cart component that displays items in the cart and checkout buttons.
 *
 * @param {Object} props - The component props
 * @param {Function} [props.setSelf] - Optional state setter to close/hide the cart component (e.g. if used inside a modal)
 * @param {string} [props.className] - Optional CSS class name to apply to the container
 */
export const Cart = (props) => {
    const navigate = useNavigate()
    const cartItems = useCreateCartItems()

    // Show empty message if cart is loading or empty
    if (cartItems.arranged == "loading") {
        return (
            <h1 className={`${style.empty}`}>Your cart is empty</h1>
        )
    }

    // Handle navigation and close cart modal if applicable
    function handleClick(event) {
        if (props?.setSelf) {
            props?.setSelf(false)
        }
        navigate(`/${event.target.value}`)

    }
    try {
        return (
            <div className={props.className}>
                <div className={style.cart}>
                    <div className={style.cartItems}>
                        {/* Render individual cart items */}
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
    } catch (e) {
        // Fallback to empty state on error
        return (
            <h1 className={`${style.empty}`}>Your cart is empty</h1>
        )
    }

}