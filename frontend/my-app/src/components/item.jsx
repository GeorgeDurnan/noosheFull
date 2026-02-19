import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getCakeById } from "../features/slices/cakeSlice"
import { CreateAllergens } from "../utilities/createAllergens"
import { getCakeOptCats } from "../features/hooks/getCakeOptCats"
import { getCakeOptions } from "../features/hooks/getCakeOptions"
import { MapOptions } from "../utilities/mapOptions"
import { Quantity } from "../utilities/quantity"
export const Item = ({ id, item, setItem }) => {
    const [sortedOptions, setSortedOptions] = useState([])
    const [optionCats, setOptionCats] = useState([])
    const [order, setOrder] = useState({})
    const cake = useSelector((state => getCakeById(state, item)))
    const [price, setPrice] = useState(0)
    const[price2, setPrice2] = useState(price)
    useEffect(() => {
        console.log("item" + JSON.stringify(item))
        if (item) {
            // When an item is selected, freeze the body scroll
            document.body.style.overflow = 'hidden';
            setPrice(cake.price)
            async function getOpts() {
                setSortedOptions(await getCakeOptions(item))
                setOptionCats(await getCakeOptCats(item))
            }
            getOpts()

        } else {
            // When no item is selected, enable scroll
            document.body.style.overflow = 'unset';
        }

        // Cleanup: Ensures scroll is re-enabled if component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [item]);
    function handleClick() {
        setItem("")
    }
    if (!item) {
        return
    }


    return (
        <div className="modal-container">
            <div className="modal">
                <button className="btn-top" onClick={handleClick}>X</button>
                <img src={cake.imgs[0]?.url || null} alt={cake.name} />
                <h1>{cake.name}</h1>
                <h2 className="itemDesc">{cake.description}</h2>
                <CreateAllergens allergens={cake.allergens || []} />
                <MapOptions sortedOptions={sortedOptions} optionCats={optionCats} price={price} setPrice={setPrice} basePrice={cake.price} order={order} setOrder={setOrder} />
                <textarea placeholder="We'll do our best to accomodate any requests when possible." id="special" name="special" rows="4" cols="50"/>
                <Quantity setPrice={setPrice} setPrice2={setPrice2} price={price}/>
                <button className="btn btm">Add to cart £{price2}</button>
            </div>
        </div>

    )
}