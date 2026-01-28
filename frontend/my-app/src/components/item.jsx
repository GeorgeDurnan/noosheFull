import { useSelector } from "react-redux"
import { getCakeById } from "../features/slices/cakeSlice"
export const Item = ({ id, item, setItem }) => {
    function handleClick() {
        setItem("")
    }
    const cake = useSelector((state => getCakeById(state, item)))
    if (!item) {
        return
    }

    return (
        <div class="modal-container">
            <div className="modal">
                <button className ="btn top" onClick={handleClick}>X</button>
                <img src={cake.image} alt={cake.name} />
                <h1>{cake.name}</h1>
                <h2 className = "itemDesc">{cake.description}</h2>
                <button className="btn btm">Add to cart £{cake.price}</button>
            </div>
        </div>

    )
}