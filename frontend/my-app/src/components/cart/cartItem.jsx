import { removeItem } from "../../features/slices/cartSlice"
import { QuantityCart } from "./quantityCart"
import { useDispatch } from "react-redux"
import style from "./cart.module.css"
import styles2 from "./cartPage.module.css"
import { BinIcon } from "../../images/svgs/binIcon"

/**
 * CartItem component displays a single item in the cart.
 * 
 * @param {Object} props
 * @param {Object} props.item - The cart item object (includes name, price, img, quantity, etc.)
 * @param {boolean} props.cart - If true, uses compact cart styles  otherwise uses page cart styles.
 */
export const CartItem = ({ item, cart }) => {
    const dispatch = useDispatch()

    // Dispatch action to remove this item from the cart
    function handleDelete() {
        dispatch(removeItem(item))
    }

    return (
        <div className={cart ? style.cartItem : styles2.cartItem} key={JSON.stringify(item)}>
            {/* Item Image */}
            <div className={`${style.imgWrapper} ${styles2.imgWrapper} `}>
                <img className={`${style.cartImg} ${styles2.cartImg} `} src={item.img} alt={item.name} />
            </div>
            
            {/* Item Details */}
            <div className={cart ? style.cartItemDescription : styles2.cartItemDescription}>
                <h2>{item.name}</h2>
                <h2>£{item.price.toFixed(2)}</h2>

                {/* Display selected options */}
                {item["optionsFlat"].map((option) => {
                    return <h1 key={option}>{option}</h1>
                })}
                
                {/* Display extra notes if present */}
                {item?.extra && <><h2>Notes:</h2>
                    <h2>{item.extra}</h2></>}

                {/* Quantity Controls and Total Price */}
                <div className={style.quantityTotal}>
                    <QuantityCart item={item} />
                    <h2 className={style.price}>£{(item.price * item.quantity).toFixed(2)}</h2>
                </div>
            </div>
            
            {/* Delete Button (Bin Icon) */}
            <div className={style.bin} onClick={handleDelete} >
                <BinIcon />
            </div>
        </div>
    )
}