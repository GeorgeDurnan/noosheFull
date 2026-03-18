import style from "./cartPage.module.css"
import { useDispatch } from "react-redux"
import { CartItem } from "./cartItem"
import { useCreateCartItems } from "../../utilities/carts/createCartItems"
import { setPrice } from "../../features/slices/cartSlice"
export const BasicCart = () => {
    // Retrieve structured cart items and price calculation from utility hook
    const cartItems = useCreateCartItems()
    const dispatch = useDispatch()

    // Update the global state with the calculated total price
    dispatch(setPrice(cartItems.price))

    // Display a message if the cart is loading or empty
    if (cartItems == "loading") {
        return (
            <h1 className={`${style.empty}`}>Your cart is empty</h1>
        )
    }

    // Render the list of items in the cart
    return (
        <div className={style.cartCon}>
            <div className={style.cartItems}>
                {cartItems.arranged.map((item) => {
                    return <CartItem key={JSON.stringify(item)} cart={false} item={item} />
                })}
            </div>
        </div>
    )
}