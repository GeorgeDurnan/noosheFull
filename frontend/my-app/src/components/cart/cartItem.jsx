import { removeItem } from "../../features/slices/cartSlice"
import { QuantityCart } from "./quantityCart"
import { useDispatch } from "react-redux"
import style from "./cart.module.css"
import styles2 from "./cartPage.module.css"
import { BinIcon } from "../../images/svgs/binIcon"
export const CartItem = ({ item, cart }) => {
    const dispatch = useDispatch()
    function handleDelete() {
        dispatch(removeItem(item))
    }

    return (
        <div className={cart ? style.cartItem : styles2.cartItem} key={JSON.stringify(item)}>
            <div className={`${style.imgWrapper} ${styles2.imgWrapper} `}>
                <img className={`${style.cartImg} ${styles2.cartImg} `} src={item.img} alt={item.name} />
            </div>
            <div className={cart ? style.cartItemDescription : styles2.cartItemDescription}>
                <h2>{item.name}</h2>
                <h2>£{item.price.toFixed(2)}</h2>

                {item["optionsFlat"].map((option) => {
                    return <h1 key={option}>{option}</h1>
                })}
                {item?.extra && <><h2>Notes:</h2>
                    <h2>{item.extra}</h2></>}

                <div className={style.quantityTotal}>
                    <QuantityCart item={item} />
                    <h2 className={style.price}>£{(item.price * item.quantity).toFixed(2)}</h2>
                </div>
            </div>
            {/*bin icon*/}
            <div className={style.bin} onClick={handleDelete} >
                <BinIcon />
            </div>
        </div>
    )
}