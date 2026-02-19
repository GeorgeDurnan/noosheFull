import { useEffect, useState } from "react"
import { CreateAllergens } from "../../../../../features/utilities/createAllergens"
import { MapOptions } from "./mapOptions"
export const Preview = ({ cake, options, optionCats }) => {
    const [show, setShow] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [cakeImages, setCakeImages] = useState([])
    const[price, setPrice] = useState(cake["price"])
    useEffect(()=>{
        if(!cake["img"]){
            return
        }
        setCakeImages(cake["img"].filter(Boolean))
    }, [cake["img"]])
    function handleClick() {
        setShow(prev => !prev)
    }
    function handleClickModal() {
        setShowModal(prev => !prev)
    }
    let sortedOptions = { ...options }
    const cats = Object.keys(sortedOptions)
    cats.forEach(cat => {
        sortedOptions[cat] = sortedOptions[cat].filter(Boolean)
    });
    return (
        <div>
            <button onClick={handleClick}>Click here to open preview</button>
            <button onClick={handleClickModal}>Click here to open modal</button>
            {show &&
                <div>
                    <h1>{cake["category"]}</h1>
                    <img className = "preview image" src={URL.createObjectURL(cakeImages[0]["file"])} alt={cake.name} />
                    <h1>Within the page</h1>
                    <div className="cakeText">
                        <h1 className="cakeName">{cake.name}</h1>
                        <h2 className="cakeDesc">{cake.description}</h2>
                        {cake.price && (<h1 className="cakePrice">£{cake.price}</h1>)}
                    </div>
                </div>}

            {showModal &&
                <div>
                    <h1>As its own page</h1>
                    <div>
                        <button className="btn top">X</button>
                        <img className = "preview image" src={URL.createObjectURL(cakeImages[0]["file"])} alt={cake.name} />
                        <h1>{cake.name}</h1>
                        <h2 className="itemDesc">{cake.description}</h2>
                        <button className="btn btm">Add to cart £{price}</button>
                        <MapOptions sortedOptions={sortedOptions} optionCats={optionCats} price={price} setPrice={setPrice} basePrice={cake.price}/>
                        <CreateAllergens allergens={cake["allergens"]} />
                        <button>Add to cart | {price || cake.price}</button>
                    </div>
                </div>}
        </div>
    )
}