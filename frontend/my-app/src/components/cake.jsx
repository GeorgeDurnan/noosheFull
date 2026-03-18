import { CreateAllergens } from "../utilities/createAllergens"
import style from "../components/pages/shop.module.css"

/**
 * Renders a single cake item card with image, details, and price.
 * 
 * @param {Object} props
 * @param {Object} props.cake - The cake data object (id, name, description, price, allergens, imgs).
 * @param {Function} props.setItem - State setter to update the selected item ID.
 */
export const Cake = ({ cake, setItem }) => {
    
    // Selects this cake when clicked
    function handleClick() {
        setItem(cake.id)
    }
    return (
        <div className={`${style.cake} ${style.openCake}`} onClick = {handleClick}>
            <img src={cake.imgs[0]?.url || null} alt={cake.name} />
            <div className={`${style.cakeText}`}>
                <h1 className={`${style.cakeName}`}>{cake.name}</h1>
                <h2 className={`${style.cakeDesc}`}>{cake.description}</h2>
                <h1 className={`${style.cakePrice}`}>£{cake.price}</h1>
                <CreateAllergens allergens={cake.allergens} labels={false}/>
            </div>
        </div>
    )
}