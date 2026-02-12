import { useEffect } from "react"
export const Query = ({ category = "users", input, setInput, choice, setChoice, setQueryData }) => {
    const categories = {
        "users": [["get all users", ["/users", "GET"], false]]
    };


    function handleChoice(event) {
        setChoice(event.target.value)
        setQueryData(categories[category][0])
    }
    if (category == "") {
        return
    } else {
        return (
            <>
                <label htmlFor="categories">Choose a query:</label>
                <select id="queries" name="queries"
                    value={choice}
                    onChange={handleChoice}>
                    <option value="" disabled> -- select an option -- </option>
                    {categories[category].map(element => {
                        return <option key={element[0]} value={element[0]}>{element[0]}</option>

                    })}
                </select>
                <input type="text" id="input" name="input" value={input} onChange={(e) => setInput(e.target.value)} />
                <input type="submit" />
            </>

        )
    }

}