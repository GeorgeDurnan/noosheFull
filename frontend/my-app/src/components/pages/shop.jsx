import { useSelector } from "react-redux"
import { getCakes } from "../../features/slices/cakeSlice"
import { Cake } from "../cake"
import { Item } from "../item"
import { useEffect, useState } from "react"
import { getOrderedCakes } from "../../features/slices/cakeSlice"
import { getRankedCats } from "../../features/slices/cakeSlice"
import { AddressModal } from "./payment/addressModal"
export const Shop = () => {
    const catsArray = useSelector(getRankedCats)
    const married = useSelector(getOrderedCakes)
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
        <div className="shop">
            <h1>Cakes</h1>
            <div className="cakes">
                {catsArray.map(cat => {
                    if (!married[cat.id]?.length > 0) {
                        return
                    }
                    return (
                        <div key={cat.description}>
                            <h1>{cat.description}</h1>
                            <div className="cakes">
                                {married[cat.id]?.map((cake) => {
                                    return (
                                        <Cake key={cake.id} cake={cake} item={item} setItem={setItem} />
                                    )
                                })}
                            </div>
                        </div>
                    )

                })}

                <Item item={item} setItem={setItem} setCart={setCart} cart={cart} setShow={setShow} order={order} setOrder={setOrder}/>
                {show && <AddressModal setShow={setShow} order={order}/>}
            </div>
        </div>
    )
}