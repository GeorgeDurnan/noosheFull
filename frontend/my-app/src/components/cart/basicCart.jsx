import style from "./cartPage.module.css"
import { useDispatch } from "react-redux"
import { CartItem } from "./cartItem"
import { useCreateCartItems } from "../../utilities/carts/createCartItems"
import { setPrice } from "../../features/slices/cartSlice"
export const BasicCart = () => {
    const cartItems = useCreateCartItems()
    const dispatch = useDispatch()
    dispatch(setPrice(cartItems.price))
    if (cartItems == "loading") {
        return (
            <h1 className={`${style.empty}`}>Your cart is empty</h1>
        )
    }
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