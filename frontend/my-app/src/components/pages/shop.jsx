import { useSelector } from "react-redux"
import { Cake } from "../cake"
import { Item } from "../item"
import { useState } from "react"
import { getOrderedCakes } from "../../features/slices/cakeSlice"
import { getRankedCats } from "../../features/slices/cakeSlice"
import { AddressModal } from "./payment/addressModal"
import styles from "./shop.module.css"
import { getAddressFromSlice } from "../../features/slices/addressSlice"
export const Shop = () => {
    const catsArray = useSelector(getRankedCats)
    const married = useSelector(getOrderedCakes)
    const basic = useSelector(getAddressFromSlice)
    const [order, setOrder] = useState()
    const [cart, setCart] = useState({})
    const [item, setItem] = useState(null)
    const [show, setShow] = useState(false)
    if (catsArray.length === 0 || Object.values(married).length === 0) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className={styles.shop} >
            {basic && <h3>Shipping to {basic.label}</h3>}
            <h4 onClick={() => { setShow(true) }}>{basic ? "Change address" : "Add address"}</h4>
            {show && <AddressModal setShow={setShow} show={show} />}
            <div className={styles.titleBorder}>
                <h1 className={`${styles.cakes} ${styles.title}`}>Online Orders:</h1>
            </div>
            <div className={styles.cakes}>
                {catsArray.map(cat => {
                    if (!married[cat.id]?.length > 0) {
                        return
                    }
                    return (
                        <div key={cat.description} className={styles.title}>
                            <h1>{cat.description}</h1>
                            <div className={styles.cakes}>
                                {married[cat.id]?.map((cake) => {
                                    return (
                                            <Cake key={cake.id} cake={cake} item={item} setItem={setItem} />
                                    )
                                })}
                            </div>
                        </div>
                    )

                })}

                <Item item={item} setItem={setItem} setCart={setCart} cart={cart} setShow={setShow} order={order} setOrder={setOrder} />
            </div>
        </div>
    )
}