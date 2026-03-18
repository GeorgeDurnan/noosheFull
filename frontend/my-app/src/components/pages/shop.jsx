import { useSelector } from "react-redux"
import { Cake } from "../cake"
import { Item } from "../item"
import { useState } from "react"
import { getOrderedCakes } from "../../features/slices/cakeSlice"
import { getRankedCats } from "../../features/slices/cakeSlice"
import { AddressModal } from "./payment/addressModal"
import styles from "./shop.module.css"
import { getAddressFromSlice } from "../../features/slices/addressSlice"
/**
 * Shop Component
 * Displays a list of cakes organized by category.
 * Allows users to view details, add to cart, and manage shipping address.
 */
export const Shop = () => {
    // Redux selectors
    const catsArray = useSelector(getRankedCats) // List of cake categories
    const married = useSelector(getOrderedCakes) // Cakes grouped by category ID
    const basic = useSelector(getAddressFromSlice) // Current selected shipping address

    // Local state
    const [order, setOrder] = useState() // Current order state
    const [cart, setCart] = useState({}) // Cart state
    const [item, setItem] = useState(null) // Currently selected item for detailed view
    const [show, setShow] = useState(false) // Controls visibility of the AddressModal

    // Show loading state if categories or cakes haven't loaded yet
    if (catsArray.length === 0 || Object.values(married).length === 0) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className={styles.shop} >
            {/* Address Management Section */}
            {basic && <h3>Shipping to {basic.label}</h3>}
            <h4 onClick={() => { setShow(true) }}>{basic ? "Change address" : "Add address"}</h4>
            {show && <AddressModal setShow={setShow} show={show} />}
            <div className={styles.titleBorder}>
                <h1 className={`${styles.cakes} ${styles.title}`}>Online Orders:</h1>
            </div>
            {/* Cake Categories Display */}
            <div className={styles.cakes}>
                {catsArray.map(cat => {
                    // Skip categories with no cakes
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

                {/* Item Detail Modal/Overlay */}
                <Item item={item} setItem={setItem} setCart={setCart} cart={cart} setShow={setShow} order={order} setOrder={setOrder} />
            </div>
        </div>
    )
}