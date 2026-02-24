import CreatableSelect from "react-select/creatable"
import Select from "react-select"
import { useState } from "react";
import { GetImages } from "./getImages";
import { upload } from "../../../../../features/utilities/upload/upload";
import { postProductCat } from "../../../../../features/utilities/upload/postProductCat";
import { deleteElement } from "../../../../../features/utilities/upload/delete";
import { updateEntry } from "../../../../../features/utilities/upload/updateCakeCat";
export const AddCake = ({ cake, setCake, categories, setReload }) => {
    const allergens = [
        { value: "lactose", label: "Lactose" },
        { value: "eggs", label: "Eggs" },
        { value: "fish", label: "Fish" },
        { value: "molluscs", label: "Molluscs" },
        { value: "tree_nuts", label: "Tree Nuts" },
        { value: "peanuts", label: "Peanuts" },
        { value: "gluten", label: "Gluten" },
        { value: "soy", label: "Soy" },
        { value: "sesame", label: "Sesame" },
        { value: "sulphides", label: "Sulphides" },
        { value: "mustard", label: "Mustard" },
        { value: "lupin", label: "Lupin" },
        { value: "crustaceans", label: "Crustaceans" },
        { value: "celery", label: "Celery" },
        { value: "gluten_free", lable: "Gluten Free" }
    ];
    //new category buffer
    const [newCat, setNewCat] = useState({})
    //state whether to show update category inputs
    const [show, setShow] = useState(false)
    //state to show add category form or not
    const [showCat, setShowCat] = useState(false)
    //update buffer
    const [update, setUpdate] = useState({})
    async function handleSubmit(event) {
        event.preventDefault()
        const repo = await postProductCat(newCat)
        console.log(repo)
        const data = await repo.json()

        if (repo.status !== 201) {
            alert("Error category not added" + JSON.stringify(data.error))
        } else {
            setReload(prev => !prev)
            setNewCat({})
        }


    }
    async function handleDelete() {
        try {
            const repo = await deleteElement(cake.category.id, "cakeCats")
            const text = await repo.json()
            console.log(text)
            if (repo.status == 200) {
                alert("Succes deleted ")
                setReload(prev => !prev)
                setCake(prev => ({ ...prev, "category": null }))

            } else {
                alert("error: " + JSON.stringify(text.error))
            }
        } catch (e) {
            alert("error" + e)
        }
    }
    async function handleUpdateSubmit(event) {
        event.preventDefault()
        try {
            const repo = await updateEntry(update, cake.category.id, "cakeCats")
            const text = await repo.json()
            console.log(text)
            if (repo.status == 200) {
                alert("Succes cake updated ")
                setReload(prev => !prev)
                setCake(prev => ({ ...prev, "category": null }))

            } else {
                alert("error: " + JSON.stringify(text.error))
            }
        } catch (e) {
            alert("error" + e)
        }
    }
    function handleCatClick() {
        setShowCat(prev => !prev)
    }
    return (
        <div>
            <label htmlFor="name">Name</label>
            <input required type="text" id="name" name="name" value={cake["name"] || ""} onChange={(e) => setCake(prev => ({ ...prev, ["name"]: e.target.value }))} />
            <label htmlFor="price">Price</label>
            <input required type="text" id="price" name="price" value={cake["price"] || ""} onChange={(e) => setCake(prev => ({ ...prev, ["price"]: e.target.value }))} />
            <br />
            <label htmlFor="description">Description</label>
            <br />
            <textarea required id="description" name="description" value={cake["description"] || ""} onChange={(e) => setCake(prev => ({ ...prev, ["description"]: e.target.value }))} />
            <br />
            <button onClick={handleCatClick}>Create new category</button>
            <br />
            {showCat && <form onSubmit={handleSubmit}>
                <label htmlFor="newCat">Category</label>
                <input required type="text" id="newCat" name="newCat" value={newCat["description"] || ""} onChange={(e) => setNewCat(prev => ({ ...prev, description: e.target.value }))} />
                <label htmlFor="catRank">Rank</label>
                <input required type="number" id="catRank" name="catRank" value={newCat["rank"] || ""} onChange={(e) => setNewCat(prev => ({ ...prev, rank: e.target.value }))} />
                <input type="submit" />
            </form>}
            <label htmlFor="cakeCat">Category</label>
            <Select
                id="cakeCat"
                isClearable
                options={categories}
                value={categories.find(option => option.value === cake.category) || null}
                onChange={(e) => setCake(prev => ({ ...prev, category: e ? e.value : "" }))}
                required
            />
            {cake.category && <><button onClick={handleDelete}>Deleted seleted category?</button>
                <button onClick={() => { setShow(prev => !prev) }}>Update selected category?</button> </>}
            {show && <form onSubmit={handleUpdateSubmit}>
                <input type="text" placeholder="description" id="description" name="description" value={update["description"] || cake.category.description} onChange={(e) => setUpdate(prev => ({ ...prev, "description": e.target.value }))} />
                <input type="number" placeholder="rank" id="rank" name="rank" value={update["rank"] || cake.category.rank} onChange={(e) => setUpdate(prev => ({ ...prev, "rank": e.target.value }))} />
                <input type="submit" />
            </form>}
            <br />
            <label htmlFor="allergens">Allergens</label>
            <Select isMulti options={allergens}
                required
                id="allergens"
                onChange={(e) => setCake(prev => ({ ...prev, allergens: e || [] }))}
            />
        </div>
    )
}
