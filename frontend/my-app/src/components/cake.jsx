export const Cake = ({ cake, item, setItem }) => {
    function handleClick() {
        setItem(cake.id)
        console.log("click")
    }
    return (
        <div className="cake openCake" onClick = {handleClick}>
            <img src={cake.image} alt={cake.name} />
            <div className="cakeText">
                <h1 className="cakeName">{cake.name}</h1>
                <h2 className="cakeDesc">{cake.description}</h2>
                <h1 className="cakePrice">£{cake.price}</h1>
            </div>
        </div>
    )
}