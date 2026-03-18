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
import { getAddressFromSlice } from "../features/slices/addressSlice"
import { useNoScroll, useClickOutside } from "../features/hooks/modalUtilities"
import modalStyles from "./modals.module.css"
import itemStyle from "./item.module.css"

/**
 * Item Component
 * 
 * Displays a modal for a specific product item, allowing users to customize options,
 * set quantity, and add the item to their cart.
 * 
 * @param {string|number|null} item - The current item ID being displayed. If false/null, modal is hidden.
 * @param {Function} setItem - State setter to control the item modal visibility (passed false/null to close).
 * @param {Function} setShow - Function to show the address/login modal if address is missing.
 * @param {Object} order - The current order object being constructed.
 * @param {Function} setOrder - State setter to update the order object.
 */
export const Item = ({item, setItem,setShow, order, setOrder }) => {
    const dispatch = useDispatch()
    const [sortedOptions, setSortedOptions] = useState([])
    const [optionCats, setOptionCats] = useState([])
    const [chosenOptions, setChosenOptions] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [extra, setExtra] = useState(null)
    
    // Fetch product details from the store
    let cake = useSelector((state => getCakeById(state, item)))
    const address = useSelector(getAddressFromSlice)
    
    const [price, setPrice] = useState(0)
    const [price2, setPrice2] = useState(price)

    // Prevent background scrolling while modal is open
    useNoScroll(item)

    /**
     * Resets local state (quantity, extra requests) and closes the modal.
     */
    const handleClose = () => {
        setItem(false)
        setQuantity(1)
        setExtra(null)
    }

    // Close modal when clicking outside of it
    const modalRef = useClickOutside(item, setItem, handleClose)

    // Load options and categories when item changes
    useEffect(() => {
        if (item) {
            setPrice(cake.price)
            async function getOpts() {
                setSortedOptions(await getCakeOptions(item))
                setOptionCats(await getCakeOptCats(item))
            }
            getOpts()
        }
    }, [item]) 
    
    // Sync local state to the parent order object whenever selection changes
    useEffect(() => {
        if (item) {
            setOrder({ product_id: item, quantity: quantity, options: chosenOptions, price: price, extra: extra })
        }

    }, [item, quantity, chosenOptions, price2, extra])

    /**
     * Handles adding the item to the cart.
     * Checks if address is set; if not, triggers the address modal.
     * Otherwise, dispatches the item to the cart and closes the modal.
     */
    function handleClickAddToCart() {

        if (!address) {
            handleClose()
            setShow(true)

        } else {
            dispatch(addItem(order))
            handleClose()
        }
    }
    function handleClick() {
        handleClose()
    }
    if (!item) {
        return
    }


    return (
        <div className={`${modalStyles.modalContainer} ${modalStyles.modalConItem}`} >
            <div className={`${modalStyles.modal} ${modalStyles.modalItem}`} ref={modalRef}>
                <button className={modalStyles.btnTop} onClick={handleClick}>X</button>
                <Images images={cake.imgs} />
                <div className={itemStyle.body}>
                    <h1>{cake.name}</h1>
                    <h2 className={itemStyle.itemDesc}>{cake.description}</h2>
                    <CreateAllergens allergens={cake.allergens || []} />
                    <MapOptions setChosenOptions={setChosenOptions} chosenOptions={chosenOptions} sortedOptions={sortedOptions} optionCats={optionCats} price={price} setPrice={setPrice} basePrice={cake.price} item={item} />
                    <div>
                        <h4>Special Request</h4>
                        <div className={itemStyle.wrapper}>
                            <textarea className={itemStyle.box} placeholder="We'll do our best to accomodate any requests when possible." id="special" name="special" rows="4" cols="50" value={extra || ""} onChange={(e) => setExtra(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <h4>Quantity</h4>
                        <div className={itemStyle.quantityTotal}>
                            <Quantity setQuantity={setQuantity} quantity={quantity} setOrder={setOrder} setPrice={setPrice} setPrice2={setPrice2} price={price} />
                        </div>
                    </div>
                </div>
                <div className={itemStyle.btnBtmCon}>
                    <button className={itemStyle.btnBtm} onClick={handleClickAddToCart}>Add to cart £{price2.toFixed(2)}</button>
                </div>

            </div>
        </div>

    )
}