import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { getCakeById } from "../features/slices/cakeSlice"
import { CreateAllergens } from "../utilities/createAllergens"
import { getCakeOptCats } from "../features/hooks/getCakeOptCats"
import { getCakeOptions } from "../features/hooks/getCakeOptions"
import { MapOptions } from "../utilities/mapOptions"
import { Quantity } from "../utilities/quantity"
import { Images } from "./images"
import { addItem } from "../features/slices/cartSlice"
import { useRef } from "react"
import { getAddressFromSlice } from "../features/slices/addressSlice"
import { useNoScroll, useClickOutside } from "../features/hooks/modalUtilities"
export const Item = ({ id, item, setItem, cart, setCart, setShow, order, setOrder }) => {
    const dispatch = useDispatch()
    const [sortedOptions, setSortedOptions] = useState([])
    const [optionCats, setOptionCats] = useState([])
    const [chosenOptions, setChosenOptions] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [extra, setExtra] = useState(null)
    let cake = useSelector((state => getCakeById(state, item)))
    const address = useSelector(getAddressFromSlice)
    const [price, setPrice] = useState(0)
    const [price2, setPrice2] = useState(price)
    useNoScroll(item)
    const handleClose = () => {
        setItem(false)
        setQuantity(1)
        setExtra(null)
    }
    const modalRef = useClickOutside(item, setItem, handleClose)
    useEffect(() => {
        if (item) {
            setPrice(cake.price)
            async function getOpts() {
                setSortedOptions(await getCakeOptions(item))
                setOptionCats(await getCakeOptCats(item))
            }
            getOpts()
        }
    }, [item]);
    useEffect(() => {
        if (item) {
            setOrder({ product_id: item, quantity: quantity, options: chosenOptions, price: price, extra: extra })
        }

    }, [item, quantity, chosenOptions, price2, extra])
    function handleClickAddToCart() {

        if (!address) {
            handleClose()
            setShow(true)

        } else {
            dispatch(addItem(order))
            //set quantity to 1 so the quantity isnt saved across cake modals
            handleClose()
        }
        //this closes the modal


    }
    function handleClick() {
        handleClose()
    }
    if (!item) {
        //setSortedOptions([])

        return
    }


    return (
        <div className="modal-container modal-con-item" >
            <div className="modal modal-item" ref={modalRef}>
                <button className="btn-top" onClick={handleClick}>X</button>
                <Images images={cake.imgs} />
                <h1>{cake.name}</h1>
                <h2 className="itemDesc">{cake.description}</h2>
                <CreateAllergens allergens={cake.allergens || []} />
                <MapOptions setChosenOptions={setChosenOptions} chosenOptions={chosenOptions} sortedOptions={sortedOptions} optionCats={optionCats} price={price} setPrice={setPrice} basePrice={cake.price} item={item} />
                <textarea placeholder="We'll do our best to accomodate any requests when possible." id="special" name="special" rows="4" cols="50" value={extra || ""} onChange={(e) => setExtra(e.target.value)} />
                <Quantity setQuantity={setQuantity} quantity={quantity} setOrder={setOrder} setPrice={setPrice} setPrice2={setPrice2} price={price} />
                <button className="btn btm" onClick={handleClickAddToCart}>Add to cart £{price2.toFixed(2)}</button>
            </div>
        </div>

    )
}