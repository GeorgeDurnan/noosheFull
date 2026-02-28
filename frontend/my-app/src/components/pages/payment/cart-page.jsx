
import { useSelector } from "react-redux"
import { getCart } from "../../../features/slices/cartSlice"
import { Cart } from "../../cart"
export const CartPage = () => {
    const title = "Disclaimerzs"
    const body = "Stuff"
    const cart = useSelector(getCart)
    return (
        <div>
            <h1>This is your cart</h1>
            <Cart />
        </div>
    )
}