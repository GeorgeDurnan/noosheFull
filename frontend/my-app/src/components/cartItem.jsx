import { getCakeById } from "../features/slices/cakeSlice"
import { removeItem } from "../features/slices/cartSlice"
import { useSelector } from "react-redux"
import { QuantityCart } from "../utilities/quantityCart"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
export const CartItem = ({ item }) => {
    const cake = useSelector((state => getCakeById(state, item.product_id)))
    const dispatch = useDispatch()
    function handleDelete() {
        dispatch(removeItem(item))
    }
    const [price, setPrice] = useState(0)

    console.log("cake" + JSON.stringify(cake))
    console.log("item" + JSON.stringify(item))
    useEffect(() => {
        let hold = 0
        Object.values(item["options"])?.forEach((option) => {
            try {
                hold += Number(option["option"]["price"])

            } catch (e) {
                console.log("Eh boba dige chera khoda di ya" + JSON.stringify(option))
            }
        })
        setPrice(hold)
    }, [])
    if (!item || !cake) {
        return
    }


    return (
        <div className="cart-item" key={JSON.stringify(item)}>
            <img className="cart-img" src={cake["imgs"][0]["url"]} alt={cake.name} />
            <div className="cart-item-description">
                <h2>{cake.name}</h2>
                <h2>{price.toFixed(2)}</h2>
                {Object.values(item["options"]).map((option) => {
                    console.log(JSON.stringify(option))
                    return <h1 key={option.value}>{option.value}</h1>
                })}
                <div className="quantity-total">
                    <QuantityCart item={item} />
                    <h2>{(price * item.quantity).toFixed(2)}</h2>
                </div>
            </div>
            {/*bin icon*/}
            <svg className="cart-btn-img" onClick={handleDelete} viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M13.5,3 C14.327,3 15,3.673 15,4.5 L15,4.5 L15,5 L19,5 L19,6 L18,6 L18,17.5 C18,18.879 16.878,20 15.5,20 L15.5,20 L7.5,20 C6.122,20 5,18.879 5,17.5 L5,17.5 L5,6 L4,6 L4,5 L8,5 L8,4.5 C8,3.673 8.673,3 9.5,3 L9.5,3 Z M17,6 L6,6 L6,17.5 C6,18.327 6.673,19 7.5,19 L7.5,19 L15.5,19 C16.327,19 17,18.327 17,17.5 L17,17.5 L17,6 Z M10,9 L10,16 L9,16 L9,9 L10,9 Z M14,9 L14,16 L13,16 L13,9 L14,9 Z M13.5,4 L9.5,4 C9.224,4 9,4.225 9,4.5 L9,4.5 L9,5 L14,5 L14,4.5 C14,4.225 13.776,4 13.5,4 L13.5,4 Z"></path></svg>
        </div>
    )
}