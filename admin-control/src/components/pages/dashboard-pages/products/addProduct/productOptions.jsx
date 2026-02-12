import { useState } from "react"
export const ProductOptions = ({ optionCats, setOptions, options }) => {
    const [newOption, setNewOption] = useState({})
    const [msg, setMsg] = useState("")
    function handleSubmit(event) {
        event.preventDefault()
        setMsg("")
        const tempOption = { ...options }
        if (options[newOption["category"]]["rank"]) {
            setMsg("You cannot have two options with the same rank")
            return
        }
        tempOption[newOption["category"]][newOption["rank"]] = newOption
        setOptions(tempOption)
        setNewOption({})

    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="price">Price</label>
                <input requiredtype="number" id="price" name="price" value={newOption["price"] || ""} onChange={(e) => setNewOption(prev => ({ ...prev, ["price"]: e.target.value }))} required />
                <label htmlFor="category">Category</label>
                <select name="category" id="category" value={newOption["category"] || ""} onChange={(e) => setNewOption(prev => ({ ...prev, ["category"]: e.target.value }))} required>
                    <option value="" disabled hidden>
                        Choose an option...
                    </option>
                    {optionCats.map((element) => {
                        if (!element) {
                            return
                        }
                        return (
                            <option key={element.description} value={element.description}>{element.description}</option>
                        )
                    })}
                </select>
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" value={newOption["description"] || ""} onChange={(e) => setNewOption(prev => ({ ...prev, ["description"]: e.target.value }))} required />
                <label htmlFor="rank">Rank</label>
                <input type="number" id="rank" name="rank" value={newOption["rank"] || ""} onChange={(e) => setNewOption(prev => ({ ...prev, ["rank"]: e.target.value }))} required />
                <input type="submit" value="Create option" />
            </form>
            <h1>{msg}</h1>
        </div>
    )
}