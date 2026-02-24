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
export const Item = ({ id, item, setItem, cart, setCart }) => {
    const dispatch = useDispatch()
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
    //Logic to make the cake close if i click outside fo the container
    const modalRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the ref exists and the clicked element is NOT inside the ref
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setItem("");
                setQuantity(0)
            }
        };

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [item]);


    //Whatever selection the user currently has is the order
    useEffect(() => {
        if (item) {
            setOrder({ id: item, quantity: quantity, options: chosenOptions, price: price })
        }

    }, [item, quantity, chosenOptions, price2])
    function handleClickAddToCart() {
        dispatch(addItem(order))
        //set quantity to 1 so the quantity isnt saved across cake modals
        setQuantity(1)
        //this closes the modal
        setItem("")
    }
    function handleClick() {
        setQuantity(1)
        setItem("")
    }
    if (!item) {
        //setSortedOptions([])

        return
    }


    return (
        <div className="modal-container" >
            <div className="modal" ref={modalRef}>
                <button className="btn-top" onClick={handleClick}>X</button>
                <Images images={cake.imgs} />
                <h1>{cake.name}</h1>
                <h2 className="itemDesc">{cake.description}</h2>
                <CreateAllergens allergens={cake.allergens || []} />
                <MapOptions setChosenOptions={setChosenOptions} chosenOptions={chosenOptions} sortedOptions={sortedOptions} optionCats={optionCats} price={price} setPrice={setPrice} basePrice={cake.price} item={item} />
                <textarea placeholder="We'll do our best to accomodate any requests when possible." id="special" name="special" rows="4" cols="50" />
                <Quantity setQuantity={setQuantity} quantity={quantity} setOrder={setOrder} setPrice={setPrice} setPrice2={setPrice2} price={price} />
                <button className="btn btm" onClick={handleClickAddToCart}>Add to cart £{price2.toFixed(2)}</button>
            </div>
        </div>

    )
}