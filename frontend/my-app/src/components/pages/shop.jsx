import { useSelector } from "react-redux"
import { getCakes } from "../../features/slices/cakeSlice"
import { Cake } from "../cake"
import { Item } from "../item"
import { useEffect, useState } from "react"
import { getOrderedCakes } from "../../features/slices/cakeSlice"
import { getRankedCats } from "../../features/slices/cakeSlice"
export const Shop = () => {
    const catsArray = useSelector(getRankedCats)
    const married = useSelector(getOrderedCakes)
    const [cart, setCart] = useState({})
    const [item, setItem] = useState(null)
    return (
        <div className="shop">
            <h1>Cakes</h1>
            <div className="cakes">

                {catsArray.map(cat => {
                    return (
                        <div key={cat.description}>
                            <h1>{cat.description}</h1>
                            {married[cat.id].map((cake) => {
                                return (
                                    <Cake key={cake.id} cake={cake} item={item} setItem={setItem} />
                                )
                            })}
                        </div>
                    )

                })}

                <Item item={item} setItem={setItem} setCart={setCart} cart={cart}  />
            </div>
        </div>
    )
}