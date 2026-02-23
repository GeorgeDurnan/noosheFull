import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getCakeById } from "../features/slices/cakeSlice"
import { CreateAllergens } from "../utilities/createAllergens"
import { getCakeOptCats } from "../features/hooks/getCakeOptCats"
import { getCakeOptions } from "../features/hooks/getCakeOptions"
import { MapOptions } from "../utilities/mapOptions"
import { Quantity } from "../utilities/quantity"
export const Item = ({ id, item, setItem, cart, setCart }) => {
    const [sortedOptions, setSortedOptions] = useState([])
    const [optionCats, setOptionCats] = useState([])
    const [order, setOrder] = useState()
    const [chosenOptions, setChosenOptions] = useState([])
    const [quantity, setQuantity] = useState(1)
    let cake = useSelector((state => getCakeById(state, item)))
    const [price, setPrice] = useState(0)
    const [price2, setPrice2] = useState(price)
    useEffect(() => {
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
    //Whatever selection the user currently has is the order
    useEffect(() => {
        if (item) {
            setOrder({ id: item, quantity: quantity, options: chosenOptions, price: price2 })
        }

    }, [item, quantity, chosenOptions, price2])
    function handleClick() {
        setCart((prev) => {
            const key = JSON.stringify(order.options)
            const cakeTypeOrders = prev[item] || {}
            const exisitingCake = cakeTypeOrders[key] || { id: order.id, quantity: 0, options: order.options, price: 0 }
            console.log(`key = ${key} cakeTypeOrders = ${cakeTypeOrders} exisitingCake = ${exisitingCake} `)
            return {
                ...prev,
                [item]: { ...cakeTypeOrders, [key]: { ...exisitingCake, quantity: exisitingCake.quantity + order.quantity, options: chosenOptions, price: exisitingCake.price + order.price } }
            }
        })
        setItem("")
    }
    if (!item) {
        //setSortedOptions([])

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
                <MapOptions setChosenOptions={setChosenOptions} chosenOptions={chosenOptions} sortedOptions={sortedOptions} optionCats={optionCats} price={price} setPrice={setPrice} basePrice={cake.price} />
                <textarea placeholder="We'll do our best to accomodate any requests when possible." id="special" name="special" rows="4" cols="50" />
                <Quantity setQuantity={setQuantity} quantity={quantity} setOrder={setOrder} setPrice={setPrice} setPrice2={setPrice2} price={price} />
                <button className="btn btm" onClick={handleClick}>Add to cart £{price2.toFixed(2)}</button>
            </div>
        </div>

    )
}