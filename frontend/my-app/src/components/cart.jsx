import { useSelector, useDispatch } from "react-redux"
import { CartItem } from "./cartItem"
import { useNavigate } from "react-router-dom"
import { getCart } from "../features/slices/cartSlice"
import { useCreateCartItems } from "../utilities/carts/createCartItems"
export const Cart = () => {
    const cart = useSelector(getCart)
    const navigate = useNavigate()
    const cartItems = useCreateCartItems()
    if(cartItems == "loading"){
        return(
            <h1>Loading...</h1>
        )
    }
    return (
        <div>
            {cartItems.map((item) => {
                return <CartItem key={JSON.stringify(item)} item={item} />
            })}
            <button onClick={() => navigate("/cart-page")}>View cart</button>
            <button onClick={() => navigate("/checkout")}>Checkout</button>
        </div>
    )
}