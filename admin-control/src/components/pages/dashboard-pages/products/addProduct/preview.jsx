import { useEffect, useState } from "react"
import { CreateAllergens } from "../../../../../features/utilities/createAllergens"
import { MapOptions } from "./mapOptions"
export const Preview = ({ cake, options, optionCats }) => {
    const [show, setShow] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [cakeImages, setCakeImages] = useState([])
    const [price, setPrice] = useState(cake["price"] || 0)
    useEffect(() => {
        if (!cake["img"]) {
            return
        }
        setCakeImages(cake["img"].filter(Boolean))
    }, [cake["img"]])
    useEffect(() => {
        cakeImages.map((img) => {
            if (!img["link"]) {
                img["link"] = URL.createObjectURL(img("file"))
            }
        })
    }, [cakeImages])
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

    try {
        return (
            <div>
                <button onClick={handleClick}>Click here to open preview</button>
                <button onClick={handleClickModal}>Click here to open modal</button>
                {show &&
                    <div>
                        <h1>{cake["category"] || "cake category not chosen"}</h1>
                        {cakeImages?.[0]?.["link"] ? (<img className="preview image" src={(cakeImages[0]["link"])} alt={cake.name} />) : (<h1>Image not added</h1>)}
                        <h1>Within the page</h1>
                        <div className="cakeText">
                            <h1 className="cakeName">{cake.name || "Name not added"}</h1>
                            <h2 className="cakeDesc">{cake.description || "Description not added"}</h2>
                            <h1 className="cakePrice">£{cake.price || 0}</h1>
                        </div>
                    </div>}

                {showModal &&
                    <div>
                        <h1>As its own page</h1>
                        <div>
                            <button className="btn top">X</button>
                            {cakeImages?.[0]?.["link"] ? (<img className="preview image" src={(cakeImages[0]["link"])} alt={cake.name} />) : (<h1>Image not added</h1>)}
                            <h1>{cake.name || "name not added"}</h1>
                            <h2 className="itemDesc">{cake.description || "description not added"}</h2>
                            <button className="btn btm">Add to cart £{price || 0}</button>
                            <MapOptions sortedOptions={sortedOptions} optionCats={optionCats} price={price} setPrice={setPrice} basePrice={cake.price} />
                            <CreateAllergens allergens={cake["allergens"]} />
                            <button>Add to cart {price || cake.price}</button>
                        </div>
                    </div>}
            </div>)
            } catch (e) {
        return (
            <div>
                <button onClick={handleClick}>Click here to open preview</button>
                <button onClick={handleClickModal}>Click here to open modal</button>
            </div>
        )
    }
}