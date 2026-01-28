import { useSelector } from "react-redux"
import { getCakes } from "../../features/slices/cakeSlice"
import { Cake } from "../cake"
import { Item } from "../item"
import { useState } from "react"
export const Shop = () => {
    const cakeArray = useSelector(getCakes)
    const [item, setItem] = useState(null)
    return (
        <div className="shop">
            <h1>Cakes</h1>
            <div className="cakes">
                {cakeArray.map((cake) => {
                    return (
                            <Cake key={cake.id} cake={cake} item ={item} setItem ={setItem}/>
                    )
                })}
                <Item item ={item} setItem ={setItem}/>
            </div>
        </div>
    )
}