import { getCakeById } from "../features/slices/cakeSlice"
import { removeItem } from "../features/slices/cartSlice"
import { useSelector } from "react-redux"
import { QuantityCart } from "../utilities/quantityCart"
import { useDispatch } from "react-redux"
import { getCartItems } from "../features/slices/cartSlice"
import style from "./cart.module.css"
import { BinIcon } from "../images/svgs/binIcon"
export const CartItem = ({ item }) => {
    const dispatch = useDispatch()
    function handleDelete() {
        dispatch(removeItem(item))
    }

    return (
        <div className={style.cartItem} key={JSON.stringify(item)}>
            <div className={style.imgWrapper}>
                <img className={style.cartImg} src={item.img} alt={item.name} />
            </div>
            <div className={style.cartItemDescription}>
                <h2>{item.name}</h2>
                <h2>{item.price.toFixed(2)}</h2>

                {item["optionsFlat"].map((option) => {
                    return <h1 key={option}>{option}</h1>
                })}
                {item?.extra && <><h2>Notes:</h2>
                    <h2>{item.extra}</h2></>}

                <div className={style.quantityTotal}>
                    <QuantityCart item={item} />
                    <h2 className={style.price}>{(item.price * item.quantity).toFixed(2)}</h2>
                </div>
            </div>
            {/*bin icon*/}
            <div className={style.bin} onClick={handleDelete} >
                <BinIcon />
            </div>
        </div>
    )
}