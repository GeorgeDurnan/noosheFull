import { CreateAllergens } from "../utilities/createAllergens"
import style from "../components/pages/shop.module.css"
export const Cake = ({ cake, item, setItem }) => {
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