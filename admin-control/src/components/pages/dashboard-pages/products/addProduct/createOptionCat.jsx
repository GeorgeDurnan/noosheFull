import { useState } from "react"
export const CreateOptionCat = ({ setOptionCats, optionCats, setOptions, options }) => {
    const [newOptionCat, setNewOptionCat] = useState({})
    const [msg, setMsg] = useState("")

    function handleSubmit(event) {
        event.preventDefault()
        if (optionCats[newOptionCat["rank"]]) {
            setMsg("You cannot have two categories with the same rank")
            return
        }
        if (options[newOptionCat["description"]] == [] || options[newOptionCat["description"]]) {
            setMsg("You cannot have two categories with the same name")
        } else {
            options[newOptionCat["description"]] = []
        }
        setMsg("")
        const tempCat = [...optionCats]
        tempCat[newOptionCat["rank"]] = newOptionCat
        setOptionCats(tempCat)
        if (options[newOptionCat["description"]])
            setNewOptionCat({})
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="radio"
                    id="required"
                    name="selectionType"
                    checked={newOptionCat["required"] === true}
                    onChange={() => setNewOptionCat(prev => ({
                        ...prev,
                        required: true,
                        multiple: false
                    }))}
                />
                <label htmlFor="required">Required Choice</label>
                <br />
                <input
                    type="radio"
                    id="multiple"
                    name="selectionType"
                    checked={newOptionCat["multiple"] === true}
                    onChange={() => setNewOptionCat(prev => ({
                        ...prev,
                        required: false,
                        multiple: true
                    }))}
                />
                <label htmlFor="multiple">multiple Selections</label>
                <br/>
                <label htmlFor="description">Description</label>
                <input required type="text" id="description" name="description" value={newOptionCat["description"] || ""} onChange={(e) => setNewOptionCat(prev => ({ ...prev, ["description"]: e.target.value }))} />
                <br />
                <label htmlFor="rank">Rank</label>
                <input required type="number" id="rank" name="rank" value={newOptionCat["rank"] || ""} onChange={(e) => setNewOptionCat(prev => ({ ...prev, ["rank"]: e.target.value }))} />
                <br />
                <input type="submit" value="Create new category" />
            </form>
            <h1>{msg}</h1>
        </div>
    )
}