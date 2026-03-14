import { BasicCart } from "../../cart/basicCart"
import styles from "../../cart/cartPage.module.css"
import { useNavigate } from "react-router-dom"
import { getTotal } from "../../../features/slices/cartSlice"
import { useSelector } from "react-redux"
export const CartPage = () => {
    const navigate = useNavigate()
    const price = useSelector(getTotal)
    function handleClick(event) {
        navigate(`/${event.target.value}`)

    }
    return (
        <div className={styles.cart}>
            <button className={`${styles.btn} ${styles.btnTop} `} value={"checkout"} onClick={handleClick}>Checkout</button>
            <div className={styles.summary}>
                <h1 className={styles.title}>My cart</h1>
                <BasicCart />
            </div>
            <div className={styles.checkCon}>
                <h1 className={styles.title}>Summary</h1>
                <div className={styles.summaryContainer}>
                    <div className={styles.lineItem}>
                        <h4>Subtotal</h4>
                        <h4>£{price}</h4>
                    </div>

                    <div className={styles.lineItem}>
                        <h4>Delivery Fee</h4>
                        <h4>£0.00</h4>
                    </div>

                    <div className={styles.lineItem}>
                        <h4>Country</h4>
                        <h4>United Kingdom</h4>
                    </div>
                    <div className={`${styles.lineItem} ${styles.total}`}>
                        <h3>Total Price: </h3>
                        <h3>£{price}</h3>
                    </div>

                </div>

                <button className={`${styles.btn} ${styles.btnCheck} `} value={"checkout"} onClick={handleClick}>Checkout</button>
            </div>
        </div>
    )
}